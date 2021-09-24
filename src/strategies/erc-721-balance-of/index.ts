// @ts-nocheck
import { StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { requiredDefined } from '../../helpers/required/required';
import { web3Factory } from '../helpers/web3Factory';
import { flattenDeep, sumBy } from 'lodash';
import { sumBN } from '../helpers/sumBN/sumBN';

const getBalancesOfFromChain = async (token: ERC20BalanceOf, addresses:string[]): Promise<{ chainId: string, address: string, balanceOf: string }[]> => {
  const { address: ERC71Address, chainId } = token;
  requiredDefined(ERC71Address, 'address of token is required');
  requiredDefined(chainId, 'chainId of token is required');

  const web3Provider = await web3Factory(chainId);

  const erc721SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, ERC71Address);

  return await Promise.all(addresses.map(address =>
    erc721SmartContracts.methods.balanceOf(address).call()
      .then(balanceOf => ({
        address,
        balanceOf,
        chainId
      }))
  ));
};

const getBalancesOfChains = async (strategy: Strategy): Promise<{ sum: string, balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { addresses, params } = strategy;

  const balances = await Promise.all(params.tokens
    .map(param => getBalancesOfFromChain(param, addresses)));

  const flatBalances = flattenDeep(balances);

  return {
    sum: sumBN(flatBalances.map(d => d.balanceOf)),
    balances: flatBalances
  };
};
const getSymbol = async (param: ERC20BalanceOf) => {
  const { chainId, address: ERC20Address } = param;

  const web3Provider = await web3Factory(chainId);
  const erc20SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, ERC20Address);

  return Promise.all([
    erc20SmartContracts.methods.symbol().call()
  ]);
};
export const strategy = async (strategy: Strategy): StrategyReturnPromise => {
  const { params } = strategy;
  const balances = await getBalancesOfChains(strategy);
  const [symbol] = await getSymbol(params.tokens[0]);

  const amount = web3.utils.toBN(balances.sum);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    decimals: 0,
    balance: balances.sum,
    amountRequired: params.minBalance
  });

  const code = isAuthorized ? ErrorCode.SUCESS : ErrorCode.NOTENOUGH;

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    details: balances
  };
};

/*
export const strategy = (web3Provider: web3) =>
  async (strategy: Strategy): StrategyReturnPromise => {
    const { address, params } = strategy;

    assert(params.address !== undefined, 'erc20 address is required');
    assert(params.minBalance !== undefined, 'minBalance is required');

    const erc20Address = params.address;
    const erc20SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, erc20Address);

    const [balanceOf, symbol] = await Promise.all([
      erc20SmartContracts.methods.balanceOf(address).call(),
      erc20SmartContracts.methods.symbol().call()
    ]);

    const amount = web3Provider.utils.toBN(balanceOf);
    const minAmount = web3Provider.utils.toBN(params.minBalance);

    const isAuthorized = amount.gte(minAmount);

    const message = minMaxMessage({
      symbol,
      decimals: 0,
      balance: balanceOf,
      amountRequired: minAmount
    });

    const code = isAuthorized ? ErrorCode.SUCESS : ErrorCode.NOTENOUGH;

    return {
      isAuthorized,
      strategy: strategy,
      message: message,
      code
    };
  };
*/
