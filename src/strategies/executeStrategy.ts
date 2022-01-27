import { Strategy } from '../models/strategy';
import * as implementedStrategies from './strategies';
import { StrategiesReturn } from '../models/strategyReturn';
import { requiredDefined } from '../helpers/required/required';
import { CacheStrategyWrapper } from '../helpers/cacheWrapper/cacheStrategyWrapper';
import { erc721ABI } from '../abi/erc721.abi';
import { web3Factory } from './helpers/web3Factory';
import { ContractAddresses } from '../environment/environment';

const camelCase = require('camelcase');
const cacheWrapper = new CacheStrategyWrapper();

export const executeStrategies = async (strategies: Strategy[][], lounge: { tokenId: string, chainId: string }, cache = false): Promise<StrategiesReturn> => {
  const { tokenId, chainId } = lounge;
  requiredDefined(tokenId, 'tokenId must be defined');
  requiredDefined(chainId, 'chainId must be defined');
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
          strategy.tokenId = tokenId;
          const factoryFunc = () => implementedStrategies[camelCaseName](strategy);
          if (cache) {
            return cacheWrapper.execute(strategy, factoryFunc);
          } else {
            return factoryFunc();
          }
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

  const web3Provider = await web3Factory(chainId);
  const roomContract = new web3Provider.eth.Contract(erc721ABI as any, ContractAddresses[chainId]);
  const ownerOf = await roomContract.methods.ownerOf(tokenId).call().catch(() => null);

  return {
    isAuthorized,
    strategies: strategiesResults,
    owner: {
      address: ownerOf.toLowerCase()
    }
  };
};

export const executeStrategiesWithCache = (strategies: Strategy[][], lounge: { tokenId: string, chainId: string }) =>
  executeStrategies(strategies, lounge, true);
