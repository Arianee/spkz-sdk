import { required, requiredDefined } from '../required/required';
import { Strategy } from '../../models/strategy';
import { cloneDeep } from 'lodash';
import { NFTROOM } from '../../models/NFTROOM';

export const getStrategyHelperFactory = (nftRoom:NFTROOM, publicKeySOfCaller?:string[]) => {
  requiredDefined(nftRoom, 'nft room must be defined');
  required(typeof nftRoom === 'object', 'nft room must be an object');

  const replaceAddressInStrategies = (strategies) => {
    const clonedStrategies = cloneDeep(strategies);

    if (publicKeySOfCaller) {
      return clonedStrategies
        .map(orStrategy =>
          orStrategy.map(d => {
            d.addresses = publicKeySOfCaller;
            return d;
          }));
    } else {
      console.warn('strategies are return without an address');
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
    return replaceAddressInStrategies(nftRoom.strategies) || [[]];
  };

  return {
    getSectionReadStrategies: getStrategy('readStrategies'),
    getSectionWriteStrategies: getStrategy('writeStrategies'),
    getRoomStrategies: getStrategy()
  };
};
