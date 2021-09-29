import {NFTROOM} from "../NFTROOM";

export interface WriteMessageParameters {
 roomId:string;
 sectionId:string;
 payload: any;
 signature:string;
 blockchainWallet: string,
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

export interface SectionUserGet{
 roomId: string,
 sectionId: string,
 network: string,
 chainId: string
}
export interface SectionUser {
 roomId: string,
 sectionId: string,
 blockchainWallet: string,
 chainId: string;
 network: string;
 payload: string
}
export interface RoomUser {
 roomId: string,
 blockchainWallet: string,
 chainId: string;
 network: string;
 payload: string;
 roomDetails?:NFTROOM
}
