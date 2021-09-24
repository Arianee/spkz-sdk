export interface Strategy<T=ERC20BalancesOf|isExactAddresses> {
    name:string,
    addresses?:string[],
    params: any
}

export interface ERC20BalancesOf {
    minBalance:string,
    tokens:Array<ERC20BalanceOf>
}

export interface isExactAddresses {
    adresses:Array<string>
}

export interface ERC20BalanceOf {
    chainId:string,
    networkId:string,
    address:string
}
