export interface Strategy<T=ERC20BalancesOf> {
    name:string,
    addresses?:string[],
    params: T
}

export interface ERC20BalancesOf {
    minBalance:string,
    tokens:Array<ERC20BalanceOf>
}

export interface ERC20BalanceOf {
    chainId:string,
    networkId:string,
    address:string
}
