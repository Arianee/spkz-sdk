import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { ERC1155BalanceOf, ERC1155BalancesOf, ERC721BalancesOf, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { requiredDefined } from '../../helpers/required/required';
import { web3Factory } from '../helpers/web3Factory';
import { flattenDeep } from 'lodash';
import { sumBN } from '../helpers/sumBN/sumBN';
import { abbreviateTokenBN } from '../../helpers/abbreviateNumberHelper/abbreviateHelper';
import { getNameAndSymbolERC721 } from '../helpers/getSymbolAndName';
import { erc1155ABI } from '../../abi/erc1155.abi';

const getBalancesOfFromChain = async (token: ERC1155BalanceOf, addresses:string[]): Promise<{ chainId: string, address: string, balanceOf: string }[]> => {
  const { address: ERC1155Address, chainId, id } = token;
  requiredDefined(ERC1155Address, 'address of token is required');
  requiredDefined(chainId, 'chainId of token is required');
  requiredDefined(id, 'id of token is required');

  const web3Provider = await web3Factory(chainId);
  const erc1155SmartContracts = new web3Provider.eth.Contract(erc1155ABI as any, ERC1155Address);

  return await Promise.all(addresses.map(address =>
    erc1155SmartContracts.methods.balanceOf(address, id).call()
      .then(balanceOf => ({
        address,
        balanceOf,
        chainId
      }))
  ));
};

const getBalances = async (strategy: Strategy<ERC1155BalancesOf>)
  : Promise<{ sum: string, minBalance:string, minBalanceWithDecimals:string, balances: { chainId: string, address: string, balanceOf: string, }[] }> => {
  const { addresses, params } = strategy;

  const balances = await Promise.all(params.tokens
    .map(param => getBalancesOfFromChain(param, addresses)));

  const flatBalances = flattenDeep(balances);

  const minBalanceAbbreviated = abbreviateTokenBN(params.minBalance, '0');

  return {
    sum: sumBN(flatBalances.map(d => d.balanceOf)),
    balances: flatBalances,
    minBalance: minBalanceAbbreviated.abbreviated,
    minBalanceWithDecimals: minBalanceAbbreviated.abbreviated
  };
};

export const strategy = async (strategy: Strategy<ERC1155BalancesOf>): StrategyReturnPromise => {
  const { params } = strategy;
  const balances = await getBalances(strategy);
  const firstToken = params.tokens[0];
  const { symbol, name } = await getNameAndSymbolERC721({
    address: firstToken.address,
    chainId: firstToken.chainId,
    default: {
      name: params.name,
      symbol: params.symbol
    }
  });

  const amount = web3.utils.toBN(balances.sum);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    decimals: 0,
    balance: balances.sum,
    amountRequired: params.minBalance
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
    details: balances
  };
};
