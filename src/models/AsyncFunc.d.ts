export type AsyncFunc<T=any, U=any>=(...param:T[])=>Promise<U>;

export type SyncFunc<T=any, U=any>=(...param:T[])=>U;
