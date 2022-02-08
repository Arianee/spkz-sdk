
export interface Strategy<T = ERC20BalancesOf
  | ERC721BalancesOf
  | NativeBalancesOf
  | isExactAddresses
  | RoomOwner
  | ERC721BalancesOfIssuedBy
  | ERC1155BalancesOf
  | OpenseaCollectionBalanceOf
  | PoapHolderOf
  | UnlockHolderOf
  > {
  name: string,
  addresses?: string[],
  params?: T,
  tokenId?: string;
  acquireURLs?: { title: string, url: string, logo?: string }[]
}

export interface ERC20BalancesOf {
  minBalance: string,
  tokens?: Array<ERC20BalanceOf>,
  logo?: string
}

export interface NativeBalancesOf {
  minBalance: string,
  logo?: string,
  name?: string,
  symbol?: string,
  chainId: string,
  networkId: string,
}

export interface ERC721BalancesOf {
  minBalance: string,
  tokens?: Array<ERC20BalanceOf>,
  logo?: string,
  name?: string,
  symbol?: string
}

export interface isExactAddresses {
  addresses: Array<string>
}

export interface ERC721BalancesOfIssuedBy extends ERC721BalancesOf {
  issuer: string
}

export interface ERC20BalanceOf {
  chainId: string,
  networkId: string,
  address: string
}

export interface RoomOwner {
  chainId: string,
  networkId: string
}

export interface ERC1155BalanceOf extends ERC20BalanceOf {
    id: string
}

export interface ERC1155BalancesOf {
    minBalance: string,
    tokens?: Array<ERC1155BalanceOf>,
    logo?: string,
    name?: string,
    symbol?: string
}

export interface OpenseaCollectionBalanceOf{
    minBalance: string,
    logo: string,
    name: string,
    symbol: string,
    collection: string
}

export interface PoapHolderOf{
  eventId: string,
  logo?: string,
  name?: string,
  symbol?: string
}

export interface UnlockHolderOf{
  chainId: string;
  address: string;
  logo?: string,
  name?: string,
  symbol?: string
}
