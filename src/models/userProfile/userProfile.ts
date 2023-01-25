import { ResultUserProfileRPC } from './userProfileRPC';

export interface UserProfileToSend {
  avatar?: ProfileAvatar;
  ens?: ProfileEns;
  lens?: ProfileLens;
  custom?: CustomProfile;
  displayNameType?: 'ens' | 'lens' | 'custom' | 'publicAddress',
  biography?: string;
  address?: string;
}

export interface UserProfileFromStore extends ResultUserProfileRPC{
}

export interface ProfileEns{
  name:string;
  tokenId: string;
}

export interface ProfileLens {
  id: string;
  handle: string;
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

export interface CustomProfile {
  name: string;
}
