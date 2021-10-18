import cache from 'memory-cache';
import { StrategyReturn, StrategyReturnPromise } from '../../models/strategyReturn';
import { Strategy } from '../../models/strategy';

var hash = require('object-hash');

export class CacheStrategyWrapper {
  public cacheTimeout :{
    authorized:number,
    notAuthorized:number
  }={
    authorized: 1000 * 60,
    notAuthorized: 1000 * 10
  }

  private memCache = new cache.Cache();

  public keyMaker=(strategy:Strategy) => {
    return hash(strategy);
  }

  public exist=(strategy:Strategy) :boolean => {
    return this.getStrategyCache(strategy) !== null;
  }

  public getStrategyCache=(strategy:Strategy) => {
    const key = this.keyMaker(strategy);
    return this.memCache.get(key);
  }

  public addStrategyCache=(strategy:Strategy, value:any, timeout:number) => {
    const key = this.keyMaker(strategy);
    this.memCache.put(key, value, timeout);
  }

  public deleteStraetgyCache=(strategy:Strategy) => {
    if (this.exist(strategy)) {
      const key = this.keyMaker(strategy);
      this.memCache.del(key);
    }
  }

  public execute=(strategy:Strategy<any>, func:()=>StrategyReturnPromise):StrategyReturnPromise => {
    try {
      if (!this.exist(strategy)) {
        const executingStrat = func();
        this.addStrategyCache(strategy, executingStrat, this.cacheTimeout.authorized);

        executingStrat
          .then((d: StrategyReturn) => {
            if (d.isAuthorized === false) {
              this.addStrategyCache(strategy, executingStrat, this.cacheTimeout.notAuthorized);
            }
            return d;
          }).catch(e => {
            this.deleteStraetgyCache(strategy);
            return e;
          });
      }
    } catch (e) {
      this.deleteStraetgyCache(strategy);
    }
    return this.getStrategyCache(strategy);
  }
}
