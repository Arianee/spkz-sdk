export interface NetworkInfos {
  name:string;
  chain:string;
  chainId:number;
  explorers: Explorer[];
  faucets: string[];
  infoURL: string;
  nativeCurrency: Currency;
  network:string;
  networkId: number;
  rpc:string[];
  shortName:string;
}

interface Explorer{
  name:string;
  standard:string;
  url: string;
}

interface Currency{
  name:string;
  symbol: string;
  decimals: number;
}
