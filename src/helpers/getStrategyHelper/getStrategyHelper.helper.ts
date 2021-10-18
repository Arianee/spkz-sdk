import { required, requiredDefined, requiredType } from '../required/required';
import { Strategy } from '../../models/strategy';
import { cloneDeep } from 'lodash';
import { NFTROOM } from '../../models/NFTROOM';

export const getStrategyHelperFactory = (nftRoom:NFTROOM, publicKeySOfCaller?:string[]) => {
  const verifyJSON = () => {
    requiredDefined(nftRoom, {
      code: 0,
      content: nftRoom,
      message: 'nft must be an object'
    });
    requiredType(nftRoom, 'object', {
      code: 1,

      message: 'nft room must be an object'
    });
    requiredDefined(nftRoom.strategies, {
      code: 2,
      content: nftRoom,
      message: 'nft.strategies must be defined and must be an array of array [[]].'
    });

    const checkStrategies = (strats, stratlabel:string) => {
      const error = (subCode = 0) => ({
        code: 3,
        subCode,
        content: nftRoom,
        message: `strategies of ${stratlabel} must be defined and must be an array of array [[]].`
      });
      requiredType(strats, 'array', error(1));
      required(strats.length > 0, error(2));

      strats.forEach(strat => {
        requiredType(strat, 'array', error(3));
        strat.forEach(subStrat => {
          requiredDefined(subStrat.name, {
            code: 4,
            content: nftRoom,
            message: 'Your strategy has no name.'
          });
        });
      });
    };

    requiredDefined(nftRoom.strategies, 'main strategies should be defined');
    checkStrategies(nftRoom.strategies, 'main');
    if (nftRoom.sections) {
      nftRoom.sections.forEach(section => {
        if (section.readStrategies) {
          checkStrategies(section.readStrategies, `${section.id}-readStrategies`);
        }
        if (section.writeStrategies) {
          checkStrategies(section.writeStrategies, `${section.id}-readStrategies`);
        }
      });
    }
  };
  verifyJSON();

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
