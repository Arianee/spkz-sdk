export interface AuthorizationsDetails {
    blockchainWalletAddress: string,
    proxyWallet: string,
    isAuthorized: boolean
}
export interface AuthorizationsStatus {
    isAuthorized:boolean,
    authorizations: AuthorizationsDetails[]
}
