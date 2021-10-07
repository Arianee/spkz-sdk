import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { ERC20BalanceOf, ERC20BalancesOf, Strategy } from '../../models/strategy';
import { erc20ABI } from '../../abi/erc20.abi';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { web3Factory } from '../helpers/web3Factory';
import { requiredDefined, requiredType } from '../../helpers/required/required';
import { flattenDeep } from 'lodash';
import { sumBN } from '../helpers/sumBN/sumBN';

const getBalancesOfFromChain = async (token: ERC20BalanceOf, addresses:string[]): Promise<{ chainId: string, address: string, balanceOf: string }[]> => {
  const { address: ERC20Address, chainId } = token;
  requiredDefined(ERC20Address, 'address of token is required');
  requiredDefined(chainId, 'chainId of token is required');

  const web3Provider = await web3Factory(chainId);

  const erc20SmartContracts = new web3Provider.eth.Contract(erc20ABI as any, ERC20Address);

  requiredType(addresses, 'array', 'addresses has to an array');

  return await Promise.all(addresses.map(address => {
    return erc20SmartContracts.methods.balanceOf(address).call()
      .then(balanceOf => ({
        address,
        balanceOf,
        chainId
      }));
  }
  ));
};

const getBalancesOfChains = async (strategy: Strategy<ERC20BalancesOf>): Promise<{ sum: string, balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { addresses, params } = strategy;

  const balances:any[] = await Promise.all(params.tokens
    .map(param => getBalancesOfFromChain(param, addresses)));

  const flatBalances = flattenDeep(balances);

  return {
    sum: sumBN(flatBalances.map(d => d.balanceOf)),
    balances: flatBalances
  };
};
const getDecimalsAndSymbol = async (param: ERC20BalanceOf) => {
  const { chainId, address: ERC20Address } = param;

  const web3Provider = await web3Factory(chainId);
  const erc20SmartContracts = new web3Provider.eth.Contract(erc20ABI as any, ERC20Address);

  return Promise.all([
    erc20SmartContracts.methods.decimals().call(),
    erc20SmartContracts.methods.symbol().call()
  ]);
};

const getImageUrl = (token: string, chainId: string) => {
  requiredType(chainId, 'string', 'chainId should be a string');
  requiredType(chainId, 'string', 'token should be a string');

  const chainName = chainId === '1' ? 'ethereum' : 'polygon';

  return `https://storage.googleapis.com/zapper-fi-assets/tokens/${chainName}/${token}.png`;
};

const getEnrichedInformation = async (strategy: Strategy<ERC20BalancesOf>):Promise<EnrichedInformations> => {
  const tokenOnChain = strategy.params.tokens.find(d => d.chainId === '1' || d.chainId === '132');

  const logo = tokenOnChain ? getImageUrl(tokenOnChain.address, tokenOnChain.chainId) : '';

  const [decimals, symbol] = await getDecimalsAndSymbol(strategy.params.tokens[0]);
  return {
    logo,
    symbol,
    acquireURLs: strategy.acquireURLs
  };
};
export const strategy = async (strategy: Strategy<ERC20BalancesOf>): StrategyReturnPromise => {
  const { params } = strategy;

  const balances = await getBalancesOfChains(strategy);
  const [decimals, symbol] = await getDecimalsAndSymbol(params.tokens[0]);

  const amount = web3.utils.toBN(balances.sum);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    decimals,
    balance: balances.sum,
    amountRequired: params.minBalance
  });

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;
  const enrichedInformations = await getEnrichedInformation(strategy);

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    details: balances,
    enrichedInformations
  };
};
