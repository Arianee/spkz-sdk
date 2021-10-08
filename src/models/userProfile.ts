export interface UserProfile {
  avatar?: ProfileAvatar;
  ens?: ProfileEns;
  biography?: string;
  address?: string;
}

export interface ProfileEns{
  name:string;
  tokenId: string;
}

export interface ProfileAvatar{
  tokenId:string;
  name:string;
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
