import { StrategyReturnPromise } from '../../models/strategyReturn';
import { isExactAddresses, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import _ from 'lodash';

export const strategy = async (strategy: Strategy<isExactAddresses>): StrategyReturnPromise => {
  const { params, addresses } = strategy;

  const paramAddress = params.addresses.map(address => address.toLowerCase());
  const addressesToCompare = addresses.map(address => address.toLowerCase());
  var presents = _.intersectionWith(paramAddress, addressesToCompare, _.isEqual);

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
