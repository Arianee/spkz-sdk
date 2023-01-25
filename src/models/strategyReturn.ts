import { Strategy } from './strategy';

export interface AcquireUrls{
    title:string, url:string, logo?:string
}

export interface EnrichedInformations{
    acquireURLs?:AcquireUrls[]
    logo?:string,
    symbol?:string,
    name?:string
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
    owner: {
        address: string
    }
}
