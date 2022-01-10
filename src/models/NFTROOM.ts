import { StrategiesReturn, StrategyReturn } from './strategyReturn';
import { Section } from './room/recommendedAndFeaturedRoom';

export interface NFTROOM{
  endpoint: string;
  notificationEndpoint: string;
  name: string;
  description: string;
  // eslint-disable-next-line camelcase
  external_url: string;
  image: string;
  logo: string;
  strategies: any[][];
  sections: Section[];
  [key: string]: any
}

export interface RoomSection{
  id:string,
  writeStrategies?:any,
  readStrategies?:any,
  title:string,
  type?:string,
  url?:string
}

export interface FullRoomStrategies{
  roomId:string,
  room:StrategiesReturn,
  sections:{
    [sectionId:string]:{
      read:StrategiesReturn,
      write:StrategiesReturn
    }
  }
}
