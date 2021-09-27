export interface Strategy<T=ERC20BalancesOf|isExactAddresses> {
    name:string,
    addresses?:string[],
    params?: T
    chainId?:string;
    networkId?:string;
}

export interface ERC20BalancesOf {
    minBalance:string,
    tokens?:Array<ERC20BalanceOf>
}

export interface isExactAddresses {
    addresses:Array<string>
}

export interface ERC20BalanceOf {
    chainId:string,
    networkId:string,
    address:string
}
