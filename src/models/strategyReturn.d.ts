import { Strategy } from './strategy';

export interface StrategyReturn {
    strategy: Strategy
    isAuthorized: boolean,
    code:number,
    message:string
}

export type StrategyReturnPromise = Promise<StrategyReturn>;

export interface StrategiesReturn {
    strategies: StrategyReturn[][],
    isAuthorized: boolean
}
