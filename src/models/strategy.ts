export interface Strategy<T=ERC20BalancesOf|ERC721BalancesOf|isExactAddresses | RoomOwner | ERC721BalancesOfIssuedBy> {
    name:string,
    addresses?:string[],
    params?: T,
    tokenId?:string;
    acquireURLs?:{title:string, url:string, logo?:string}[]
}

export interface ERC20BalancesOf {
    minBalance:string,
    tokens?:Array<ERC20BalanceOf>,
    logo?:string
}

export interface ERC721BalancesOf {
    minBalance:string,
    tokens?:Array<ERC20BalanceOf>,
    logo?:string,
    name?:string,
    symbol?:string
}

export interface isExactAddresses {
    addresses:Array<string>
}

export interface ERC721BalancesOfIssuedBy extends ERC721BalancesOf{
    issuer:string
}

export interface ERC20BalanceOf {
    chainId:string,
    networkId:string,
    address:string
}

export interface RoomOwner {
    chainId: string,
    networkId: string}
