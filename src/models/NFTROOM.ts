export interface NFTROOM{
  strategies: Array<any[]>;
  sections: RoomSection[];

  endpoint: string;

  [key: string]: any
}

export interface RoomSection{
  id:string,
  writeStrategies?:any,
  readStrategies?:any,
  title:string
}
