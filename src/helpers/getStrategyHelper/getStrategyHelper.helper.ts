import { required, requiredDefined } from '../required';
import { Strategy } from '../../models/strategy';
import { cloneDeep } from 'lodash';
import { NFTROOM } from '../../models/NFTROOM';

export const getStrategyHelperFactory = (nftRoom:NFTROOM, publicKeyOfCaller?:string) => {
  requiredDefined(nftRoom, 'nft room must be defined');
  required(typeof nftRoom === 'object', 'nft room must be an object');

  const replaceAddressInStrategies = (strategies) => {
    const clonedStrategies = cloneDeep(strategies);

    if (publicKeyOfCaller) {
      return clonedStrategies
        .map(orStrategy =>
          orStrategy.map(d => {
            d.address = publicKeyOfCaller;
            return d;
          }));
    } else {
      console.warn('startegies are return without an address');
      return clonedStrategies;
    }
  };

  const getStrategy = (key?:string) => (sectionId?:string):Strategy[][] => {
    if (sectionId) {
      const section = nftRoom.sections.find(d => d.id === sectionId);
      requiredDefined(section, `${sectionId} does not exist on this nft room`);
      const readStrategy = section[key];
      if (readStrategy) {
        return replaceAddressInStrategies(readStrategy);
      }
    }
    console.info('nftRoom.strategies', nftRoom.strategies);
    return replaceAddressInStrategies(nftRoom.strategies) || [[]];
  };

  return {
    getSectionReadStrategies: getStrategy('readStrategies'),
    getSectionWriteStrategies: getStrategy('writeStrategies'),
    getRoomStrategies: getStrategy()
  };
};
