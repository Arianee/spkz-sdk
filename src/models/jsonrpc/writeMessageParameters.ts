export interface WriteMessageParameters {
 roomId:string;
 sectionId:string;
 payload: any;
 signature:string;
 blockchainWallet: string,
 proxyWallet: string,
 network: string,
 chainId: string
}

export interface ReadMessageParameters {
 roomId: string;
 sectionId: string;
 chainId: string;
 network: string;
 limit: number;
}
