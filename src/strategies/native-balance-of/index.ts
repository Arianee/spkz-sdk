import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { NativeBalancesOf, Strategy } from '../../models/strategy';
import { erc20ABI } from '../../abi/erc20.abi';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { web3Factory } from '../helpers/web3Factory';
import { requiredDefined, requiredType } from '../../helpers/required/required';
import { flattenDeep } from 'lodash';
import { sumBN } from '../helpers/sumBN/sumBN';
import { abbreviateTokenBN } from '../../helpers/abbreviateNumberHelper/abbreviateHelper';
import { getNameAdSymbolAndDecimalsERC20, getNameAndSymbolNative } from '../helpers/getSymbolAndName';

const getBalancesOfFromChain = async (params: NativeBalancesOf, addresses:string[]): Promise<{ chainId: string, address: string, balanceOf: string }[]> => {
  const { chainId } = params;
  requiredDefined(chainId, 'chainId of token is required');

  const web3Provider = await web3Factory(chainId);

  requiredType(addresses, 'array', 'addresses has to an array');

  return await Promise.all(addresses.map(address => {
    return web3Provider.eth.getBalance(address).then((balanceOf) => ({
      address,
      balanceOf,
      chainId
    }));
  }
  ));
};

const getBalancesOfChains = async (strategy: Strategy<NativeBalancesOf>, decimals:string): Promise<{
  sumWithDecimals:string,
  sum: string,
  decimals:string,
  balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { addresses, params } = strategy;

  const balance = await Promise.resolve(getBalancesOfFromChain(strategy.params, addresses));

  const flatBalances = flattenDeep([balance]);
  const sumWithDecimals = sumBN(flatBalances.map(d => d.balanceOf));

  const abbreviatedSum = abbreviateTokenBN(sumWithDecimals, decimals);
  return {
    decimals,
    sumWithDecimals: abbreviatedSum.withDecimals,
    sum: abbreviatedSum.abbreviated,
    balances: flatBalances
  };
};

const getImageUrl = (chainId: string) => {
  requiredType(chainId, 'string', 'chainId should be a string');
  requiredType(chainId, 'string', 'token should be a string');

  const chainName = chainId === '1' ? 'ethereum' : 'polygon';

  return `https://storage.googleapis.com/zapper-fi-assets/tokens/${chainName}/0x0000000000000000000000000000000000000000.png`;
};

const getEnrichedInformation = async (strategy: Strategy<NativeBalancesOf>):Promise<EnrichedInformations> => {
  const isErc20Token = strategy.name.includes('erc-20');

  const logo = strategy.params.logo ? strategy.params.logo : getImageUrl(strategy.params.chainId);

  const { symbol, name } = await getNameAndSymbolNative({
    chainId: strategy.params.chainId
  });
  return {
    logo,
    symbol,
    name,
    acquireURLs: strategy.acquireURLs
  };
};
export const strategy = async (strategy: Strategy<NativeBalancesOf>): StrategyReturnPromise => {
  const { params } = strategy;
  const decimals = '18';
  const balances = await getBalancesOfChains(strategy, decimals);
  const { symbol, name } = await getNameAndSymbolNative({
    chainId: strategy.params.chainId
  });

  const amount = web3.utils.toBN(balances.sumWithDecimals);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    decimals,
    balance: balances.sumWithDecimals,
    amountRequired: params.minBalance
  });

  const minBalanceAbbreviated = abbreviateTokenBN(params.minBalance, decimals);

  const details = {
    ...balances,
    minBalance: minBalanceAbbreviated.abbreviated,
    minBalanceWithDecimals: minBalanceAbbreviated.withoutDecimals
  };
  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;
  const enrichedInformations = await getEnrichedInformation(strategy);

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    details,
    enrichedInformations
  };
};
