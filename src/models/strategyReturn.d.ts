import { Strategy } from './strategy';

export interface StrategyReturn {
    strategy: Strategy
    isAuthorized: boolean,
    code:number,
    message:string,
    details?:any
}

export type StrategyReturnPromise = Promise<StrategyReturn>;

export interface StrategiesReturn {
    strategies: StrategyReturn[][],
    isAuthorized: boolean,
}
