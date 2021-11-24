import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import { isExactAddresses, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import _ from 'lodash';

const getEnrichedInformation = async (strategy: Strategy<isExactAddresses>):Promise<EnrichedInformations> => {
  const logo = 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/wallet.png';

  return {
    logo,
    symbol: 'Authorized Addresses',
    name: 'Authorized Addresses'
  };
};

export const strategy = async (strategy: Strategy<isExactAddresses>): StrategyReturnPromise => {
  const { params, addresses } = strategy;

  const paramAddress = params.addresses.map(address => address.toLowerCase());
  const addressesToCompare = addresses.map(address => address.toLowerCase());
  var presents = _.intersectionWith(paramAddress, addressesToCompare, _.isEqual);

  const isAuthorized = presents.length > 0;
  const message = presents.length > 0 ? 'Your wallet is authorized' : 'Your wallet is not authorized';

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;

  const enrichedInformations = await getEnrichedInformation(strategy);

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    enrichedInformations
  };
};
