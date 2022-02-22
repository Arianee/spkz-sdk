import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { ERC1155BalanceOf, ERC1155BalanceOfBatch, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { requiredDefined } from '../../helpers/required/required';
import { web3Factory } from '../helpers/web3Factory';
import { erc1155ABI } from '../../abi/erc1155.abi';
import { BigNumber } from 'ethers';
import axios from 'axios';

const getBalanceOfBatchFromChain = async (params: {chainId: string, address: string}, addresses: string[], ids: string[]) : Promise<string[]> => {
  const { chainId, address } = params;
  requiredDefined(chainId, 'chainId of token is required');
  requiredDefined(address, 'address of contract is required');

  const web3Provider = await web3Factory(chainId);
  const erc1155SmartContracts = new web3Provider.eth.Contract(erc1155ABI as any, address);

  return await erc1155SmartContracts.methods.balanceOfBatch(addresses, ids).call();
};

const getNamesAndImages = async (
  strategy: Strategy<ERC1155BalanceOfBatch>
): Promise<{ name?: string; image?: string }[]> => {
  const ids = strategy.params.minBalances.map((minBalance) => minBalance.id);

  const { chainId, address } = strategy.params;
  requiredDefined(chainId, 'chainId of token is required');
  requiredDefined(address, 'address of contract is required');

  const URIs = await getURIsFromChain({ chainId, address }, ids);

  return await Promise.all(
    URIs.map((uri, index) => {
      const url = uri.startsWith('ipfs://') ? 'https://ipfs.io/' + uri.replace('ipfs://', '') : uri;
      return axios
        .get(url)
        .catch((_) => {
          return { data: { name: `??? (id: ${ids[index]})`, image: '' } };
        })
        .then((res) => ({
          name: res?.data?.name,
          image: res?.data?.image.startsWith('ipfs://')
            ? 'https://ipfs.io/' + res?.data?.image.replace('ipfs://', '')
            : res?.data?.image
        }));
    })
  );
};

const getURIsFromChain = async (params: {chainId: string, address: string}, ids: string[]) : Promise<string[]> => {
  const { chainId, address } = params;
  requiredDefined(chainId, 'chainId of token is required');
  requiredDefined(address, 'address of contract is required');

  const web3Provider = await web3Factory(chainId);
  const erc1155SmartContracts = new web3Provider.eth.Contract(erc1155ABI as any, address);

  return await Promise.all(
    ids.map((id) =>
      erc1155SmartContracts.methods
        .uri(id)
        .call()
        .then((uri) => {
          const idAsHex = BigNumber.from(id).toHexString();
          return uri.replace('0x{id}', idAsHex).replace('{id}', idAsHex);
        })
    )
  );
};

const getBalances = async (strategy: Strategy<ERC1155BalanceOfBatch>) : Promise<string[]> => {
  /* We use ERC1155 balanceOfBatch(address[], id[]). In our case, address is
  * always the same (the one of the user), only id changes */

  // Array of minBalances.length * user address [0xAAA, 0xAAA..., 0XAAA]
  const addresses = strategy.params.minBalances.map(_ => strategy.addresses[0]);
  const ids = strategy.params.minBalances.map(minBalance => minBalance.id);

  return await getBalanceOfBatchFromChain(
    { chainId: strategy.params.chainId, address: strategy.params.address },
    addresses, ids
  );
};

/**
 * Returns true if all balance in balances are greater than or equal to
 * min balance of minBalances whose index is the same (balances[i] >= minBalances[i])
 * @param balances balances to be checked against minBalances
 * @param minBalances min amount of tokens required
 * @returns true if all balance are greater than or equal to min balances, false otherwise
 */
const checkAllBalances = (balances: string[], minBalances: ERC1155BalanceOf[]) : boolean => {
  let allGTE = true;

  for (let i = 0; i < minBalances.length; i++) {
    const balanceBN = BigNumber.from(balances[i]);
    const minBalanceBN = BigNumber.from(minBalances[i].amount);
    allGTE = allGTE && balanceBN.gte(minBalanceBN);
  }

  return allGTE;
};

export const strategy = async (strategy: Strategy<ERC1155BalanceOfBatch>): StrategyReturnPromise => {
  const { params } = strategy;
  if (!web3.utils.isAddress(params.address)) {
    return {
      isAuthorized: false,
      strategy: strategy,
      message: 'Invalid contract address',
      code: ErrorCode.ERRORINSTRATEGY,
      enrichedInformations: {},
      details: { namesAndImages: [], owned: [] }
    };
  }

  const balances = await getBalances(strategy);
  const namesAndImages = await getNamesAndImages(strategy);

  const firstToken = strategy.params.minBalances[0];

  const symbol = 'ERC1155';
  const name = 'ERC1155';

  const isAuthorized = checkAllBalances(balances, strategy.params.minBalances);

  const message = minMaxMessage({
    symbol,
    decimals: 0,
    balance: balances[0],
    amountRequired: firstToken.amount
  });

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;

  const enrichedInformations: EnrichedInformations = {
    symbol: symbol,
    name: name,
    logo: strategy.params.logo,
    acquireURLs: strategy.acquireURLs
  };
  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    enrichedInformations,
    details: { namesAndImages, owned: balances }
  };
};
