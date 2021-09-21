import { Strategy } from '../models/strategy';
import * as implementedStrategies from './stategies';
import assert from 'assert';
import Web3 from 'web3';
import { StrategiesReturn, StrategyReturn } from '../models/strategyReturn';
import { requiredDefined } from '../helpers/required/required';

const chainConfig = require('../../chain.config.json');

const camelCase = require('camelcase');

export const executeStrategies = async (strategies: Strategy[][]): Promise<StrategiesReturn> => {
  // Checking all strategies exist
  strategies
    .forEach(orStrategies =>
      orStrategies.forEach(strategy => {
        const camelCaseName = camelCase(strategy.name);
        assert(implementedStrategies[camelCaseName] !== undefined, `this strategy does not exist ${strategy.name}`);
      }));

  const strategiesResults = await Promise.all(
    strategies
      .map(orStrategy => {
        return Promise.all(orStrategy.map(strategy => {
          requiredDefined(strategy.chainId, `chainId is not defined, ${strategy}`);
          requiredDefined(strategy.name, `name is not defined, ${strategy}`);

          const camelCaseName = camelCase(strategy.name);
          const provider = chainConfig[strategy.chainId.toString()];
          const web3Provider = new Web3(provider);
          return implementedStrategies[camelCaseName](web3Provider)(strategy) as StrategyReturn;
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

  //    const isAuthorized = strategiesResults.map(d=>d.isAuthorized).includes(false) === false;

  // strategiesResults[0][0].isAuthorized
  return {
    isAuthorized,
    strategies: strategiesResults
    // isAuthorized,
    // strategies: strategiesResults
  };
};
