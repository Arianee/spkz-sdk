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
import { abbreviateTokenBN } from '../../helpers/abbreviateNumberHelper/abbreviateHelper';
import { getNameAdSymbolAndDecimalsERC20 } from '../helpers/getSymbolAndName';

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

const getBalancesOfChains = async (strategy: Strategy<ERC20BalancesOf>, decimals:string): Promise<{
  sumWithDecimals:string,
  sum: string,
  decimals:string,
  balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { addresses, params } = strategy;

  const balances:any[] = await Promise.all(params.tokens
    .map(param => getBalancesOfFromChain(param, addresses)));

  const flatBalances = flattenDeep(balances);
  const sumWithDecimals = sumBN(flatBalances.map(d => d.balanceOf));

  const abbreviatedSum = abbreviateTokenBN(sumWithDecimals, decimals);
  return {
    decimals,
    sumWithDecimals: abbreviatedSum.withDecimals,
    sum: abbreviatedSum.abbreviated,
    balances: flatBalances
  };
};

const getImageUrl = (token: string, chainId: string) => {
  requiredType(chainId, 'string', 'chainId should be a string');
  requiredType(chainId, 'string', 'token should be a string');

  const chainName = chainId === '1' ? 'ethereum' : 'polygon';

  return `https://storage.googleapis.com/zapper-fi-assets/tokens/${chainName}/${token.toLowerCase()}.png`;
};

const getEnrichedInformation = async (strategy: Strategy<ERC20BalancesOf>):Promise<EnrichedInformations> => {
  const tokenOnChain = strategy.params.tokens.find(d => d.chainId === '1' || d.chainId === '137');

  const isErc20Token = strategy.name.includes('erc-20');

  const logo = strategy.params.logo ? strategy.params.logo : isErc20Token && tokenOnChain ? getImageUrl(tokenOnChain.address, tokenOnChain.chainId) : 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/default-icon.png';

  const firstToken = strategy.params.tokens[0];
  const { decimals, symbol, name } = await getNameAdSymbolAndDecimalsERC20({
    address: firstToken.address,
    chainId: firstToken.chainId
  });
  return {
    logo,
    symbol,
    name,
    acquireURLs: strategy.acquireURLs
  };
};
export const strategy = async (strategy: Strategy<ERC20BalancesOf>): StrategyReturnPromise => {
  const { params } = strategy;
  const { decimals, symbol } = await getNameAdSymbolAndDecimalsERC20(params.tokens[0]);
  const balances = await getBalancesOfChains(strategy, decimals);

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
