import { StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { ERC20BalanceOf, isExactAddresses, Strategy } from '../../models/strategy';
import { erc20ABI } from '../../abi/erc20.abi';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { web3Factory } from '../helpers/web3Factory';
import { requiredDefined } from '../../helpers/required/required';
import _, { flattenDeep, sumBy } from 'lodash';
import { sumBN } from '../helpers/sumBN/sumBN';

export const strategy = async (strategy: Strategy<isExactAddresses>): StrategyReturnPromise => {
  const { params, addresses } = strategy;

  var presents = _.intersectionWith(params.addresses, addresses, _.isEqual);

  const isAuthorized = presents.length > 0;
  const message = presents.length > 0 ? 'Your wallet is authorized' : 'Your wallet is not authorized';

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code
  };
};
