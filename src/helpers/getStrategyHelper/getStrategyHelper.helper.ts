import { required, requiredDefined, requiredType } from '@arianee/required';
import { Strategy } from '../../models/strategy';
import { cloneDeep } from 'lodash';
import { NFTROOM } from '../../models/NFTROOM';

export enum StrategyHelperErrorEnum {
  NFTRoomNotAnObject = 0,
  NFTStrategiesNotAnArray = 1,
  NoSectionStrategy = 2,
  NoStrategy = 3,
  NoStrategyName = 4,
  NoEndpoint = 5,
  NoNotificationEndpoint = 6,
}

export const getStrategyHelperFactory = (nftRoom: NFTROOM, publicKeySOfCaller?: string[]) => {
  const verifyJSON = () => {
    requiredDefined(nftRoom, {
      code: StrategyHelperErrorEnum.NFTRoomNotAnObject,
      content: nftRoom,
      message: 'nft must be an object'
    });

    requiredType(nftRoom, 'object', {
      code: StrategyHelperErrorEnum.NFTRoomNotAnObject,
      content: nftRoom,
      message: 'nft must be an object'
    });

    requiredDefined(nftRoom.strategies, {
      code: StrategyHelperErrorEnum.NoStrategy,
      content: nftRoom,
      message: 'nft.strategies must be defined and must be an array of array [[]].'
    });

    requiredType(nftRoom.strategies, 'array', {
      code: StrategyHelperErrorEnum.NFTStrategiesNotAnArray,
      message: 'nft.strategies must be defined and must be an array of array [[]].'
    });
    requiredType(nftRoom.strategies[0], 'array', {
      code: StrategyHelperErrorEnum.NFTStrategiesNotAnArray,
      message: 'nft.strategies must be defined and must be an array of array [[]].'
    });

    requiredDefined(nftRoom.endpoint, {
      code: StrategyHelperErrorEnum.NoEndpoint,
      content: nftRoom.endpoint,
      message: 'endpoint must be a string.'
    });

    requiredDefined(nftRoom.notificationEndpoint, {
      code: StrategyHelperErrorEnum.NoNotificationEndpoint,
      content: nftRoom.notificationEndpoint,
      message: 'notificationEndpoint must be a string.'
    });

    requiredType(nftRoom.sections, 'array', {
      code: 7,
      content: nftRoom.sections,
      message: 'sections cannot be empty.'
    });

    const checkStrategies = (strats, stratlabel: string) => {
      const error = (subCode = 0) => ({
        code: StrategyHelperErrorEnum.NoSectionStrategy,
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
            code: StrategyHelperErrorEnum.NoStrategyName,
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

  const getStrategy = (key?: string) => (sectionId?: string): Strategy[][] => {
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
