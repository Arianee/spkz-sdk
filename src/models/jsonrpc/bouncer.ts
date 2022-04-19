export interface BouncerUser {
    blockchainWallet: string;
    payload: string;
}

export interface BouncerUserQuery {
 blockchainWallet: string;
 network:string;
 chainId:string;
}

export interface NotificationPreferences {
  blockchainWallet: string;
  payload: string;
}
