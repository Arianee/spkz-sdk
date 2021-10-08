import cache from 'memory-cache';
import crypto from 'crypto';
import { StrategiesReturn } from '../../models/strategyReturn';
var hash = require('object-hash');

export class CacheStrategyWrapper {
    public cacheTimeout :number;
    private memCache = new cache.Cache();

    constructor (cacheTimeout?:number) {
      this.cacheTimeout = 1000 * 60;
    }

    private keyMaker=(func, args:string[]) => {
      return `${this.hash(func.toString())}${args.filter(d => d)
          .map(d => hash(d))}`;
    }

    public create = <T=any>(func) => (arg1?:any, arg2?:any, arg3?:any):Promise<StrategiesReturn> => {
      const key = this.keyMaker(func, [arg1, arg2, arg3]);

      if (this.memCache.get(key) === null) {
        const cached = func(arg1, arg2, arg3);
        if (cached.catch) {
          cached.catch(e => {
            this.memCache.del(key);
          });
        }
        if (cached.then) {
          cached.then((d:StrategiesReturn) => {
            if (d.isAuthorized === false) {
              this.memCache.del(key);
            }
          });
        }
        this.memCache.put(key, cached, this.cacheTimeout);
      }

      return this.memCache.get(key);
    };

    public exist = (func, arg1?, arg2?, arg3?) => {
      const key = this.keyMaker(func, [arg1, arg2, arg3]);

      return this.memCache.get(key) !== null;
    };

    private hash = (name: string) => {
      return crypto.createHash('md5').update(name).digest('hex');
    }
}
