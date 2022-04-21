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
  roomId?: string,
  sectionId?: string,
  preferences: 'ALL' | 'MENTIONS_ONLY' | 'NONE',
}
