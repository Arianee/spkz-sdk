import { Strategy } from './strategy';

export interface EnrichedInformations{
    acquireURLs?:{title:string, url:string, logo?:string} []
    logo?:string,
    symbol?:string
}
export interface StrategyReturn {
    strategy: Strategy
    isAuthorized: boolean,
    code:number,
    message:string,
    enrichedInformations?:EnrichedInformations,
    details?:{
        [key:string]:any
    }
}

export type StrategyReturnPromise = Promise<StrategyReturn>;

export interface StrategiesReturn {
    strategies: StrategyReturn[][],
    isAuthorized: boolean,
}
