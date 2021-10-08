import { Strategy } from '../models/strategy';
import * as implementedStrategies from './strategies';
import { StrategiesReturn, StrategyReturn } from '../models/strategyReturn';
import { requiredDefined } from '../helpers/required/required';
import { CacheStrategyWrapper } from '../helpers/cacheWrapper/cacheStrategyWrapper';

const camelCase = require('camelcase');

export const executeStrategies = async (strategies: Strategy[][], tokenId:string = '0'): Promise<StrategiesReturn> => {
  // Checking all strategies exist
  strategies
    .forEach(orStrategies =>
      orStrategies.forEach(strategy => {
        const camelCaseName = camelCase(strategy.name);
        requiredDefined(implementedStrategies[camelCaseName], `this strategy does not exist ${strategy.name}`);
      }));

  const strategiesResults = await Promise.all(
    strategies
      .map(orStrategy => {
        return Promise.all(orStrategy.map(strategy => {
          requiredDefined(strategy.name, `name is not defined, ${strategy}`);

          const camelCaseName = camelCase(strategy.name);
          // remove null and undefined adresses
          strategy.addresses = strategy.addresses ? strategy.addresses.filter(d => d) : [];
          return implementedStrategies[camelCaseName](strategy, tokenId) as StrategyReturn;
        }));
      }));

  let isAuthorized = false;
  for (var strategyResult of strategiesResults) {
    const isStrategyAuthorized:boolean = strategyResult.map(d => d.isAuthorized).includes(false) === false;
    if (isStrategyAuthorized) {
      isAuthorized = isStrategyAuthorized;
      break;
    }
  }
  isAuthorized = strategiesResults.length === 0 ? true : isAuthorized;

  return {
    isAuthorized,
    strategies: strategiesResults
  };
};

const cacheWrapper = new CacheStrategyWrapper().create(executeStrategies);
export const executeStrategiesWithCache:(strategies: Strategy[][], tokenId?:string)=>Promise<StrategiesReturn> = cacheWrapper;
