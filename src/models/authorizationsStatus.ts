import { ErrorPayload } from './jsonrpc/errorPayload';

export interface AuthorizationsDetails {
    blockchainWalletAddress: string,
    proxyWallet: string,
    isAuthorized: boolean
}
export interface AuthorizationsStatus {
    isAuthorized:boolean,
    details?: ErrorPayload[],
    authorizations: AuthorizationsDetails[]
}
