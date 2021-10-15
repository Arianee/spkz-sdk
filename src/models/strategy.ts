export interface Strategy<T=ERC20BalancesOf|isExactAddresses | RoomOwner> {
    name:string,
    addresses?:string[],
    params?: T,
    tokenId?:string;
    acquireURLs?:{title:string, url:string}[]
}

export interface ERC20BalancesOf {
    minBalance:string,
    tokens?:Array<ERC20BalanceOf>,
    logo?:string
}

export interface isExactAddresses {
    addresses:Array<string>
}

export interface ERC20BalanceOf {
    chainId:string,
    networkId:string,
    address:string
}

export interface RoomOwner {
    chainId: string,
    networkId: string}
