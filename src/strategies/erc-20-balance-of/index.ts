import { StrategyReturnPromise } from '../../models/strategyReturn';
import assert from 'assert';
import web3 from 'web3';
import { Strategy } from '../../models/strategy';
import { erc20ABI } from '../../abi/erc20.abi';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';

export const strategy = (web3Provider: web3) =>
  async (strategy: Strategy): StrategyReturnPromise => {
    const { address, params } = strategy;

    assert(params.address !== undefined, 'erc20 address is required');
    assert(params.minBalance !== undefined, 'minBalance is required');

    const erc20Address = params.address;
    const erc20SmartContracts = new web3Provider.eth.Contract(erc20ABI as any, erc20Address);

    const [balanceOf, decimals, symbol] = await Promise.all([
      erc20SmartContracts.methods.balanceOf(address).call(),
      erc20SmartContracts.methods.decimals().call(),
      erc20SmartContracts.methods.symbol().call()
    ]);

    const amount = web3Provider.utils.toBN(balanceOf);
    const minAmount = web3Provider.utils.toBN(params.minBalance);

    const isAuthorized = amount.gte(minAmount);

    const message = minMaxMessage({
      symbol,
      decimals,
      balance: balanceOf,
      amountRequired: params.minBalance
    });

    const code = isAuthorized ? ErrorCode.SUCESS : ErrorCode.NOTENOUGH;

    return {
      isAuthorized,
      strategy: strategy,
      message: message,
      code
    };
  };
