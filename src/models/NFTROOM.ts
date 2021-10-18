import { StrategiesReturn, StrategyReturn } from './strategyReturn';

export interface NFTROOM{
  strategies: Array<any[]>;
  sections: RoomSection[];

  endpoint: string;
  notificationEndpoint?:string;

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
