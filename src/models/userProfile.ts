export interface UserProfile {
  avatar?: ProfileAvatar;
  ens?: ProfileEns;
  biography?: string;
}

export interface ProfileEns{
  name:string;
  tokenId: string;
}

export interface ProfileAvatar{
  tokenId:string;
  contract:{
    chainId:string;
    networkId:string;
    address:string;
    schemaName:string;
  }
  picture: {
    originalUrl: string;
    previewUrl: string;
  }
  metadataUri:string
}
