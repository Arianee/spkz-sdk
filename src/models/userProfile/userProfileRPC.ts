export interface Ens {
    name: string;
    tokenId: string;
  }

export interface Contract {
    chainId: string;
    networkId: string;
    address: string;
    schemaName: string;
  }

export interface Picture {
    originalUrl: string;
    previewUrl: string;
  }

export interface Avatar {
    tokenId: string;
    name: string;
    contract: Contract;
    picture: Picture;
    metadataUri: string;
  }

export interface Profile {
    address: string;
    ens: Ens;
    avatar: Avatar;
    biography: string;
    authorizations: string[];
    nonce: string;
    signature: string;
  }

export interface Userprofile {
    sectionId: string;
    profile: Profile;
    roomId: string;
    authorizations: string[];
    nonce: string;
    signature: string;
  }

export interface Ens2 {
    name: string;
    tokenId: string;
  }

export interface Contract2 {
    chainId: string;
    networkId: string;
    address: string;
    schemaName: string;
  }

export interface Picture2 {
    originalUrl: string;
    previewUrl: string;
  }

export interface Avatar2 {
    tokenId: string;
    name: string;
    contract: Contract2;
    picture: Picture2;
    metadataUri: string;
  }

export interface Profile2 {
    address: string;
    ens: Ens2;
    avatar: Avatar2;
    biography: string;
    authorizations: string[];
    nonce: string;
    signature: string;
  }

export interface Payload {
    sectionId: string;
    profile: Profile2;
    roomId: string;
    authorizations: string[];
    nonce: string;
    signature: string;
  }

export interface ResultUserProfileRPC {
    userprofile: Userprofile;
    id: string;
    payload: Payload;
    network: string;
    roomId: string;
    blockchainWallet: string;
    chainId: string;
    updatedAt: Date;
    createdAt: Date;
  }

export interface UserProfileRPC {
    jsonrpc: string;
    id: string;
    result: ResultUserProfileRPC[];
  }
