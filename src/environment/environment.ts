
export interface IEnvironment{
  bouncerRPCURL:string;
  bouncerURL:string;
  roomContractAddress:string;
  chainId:string;
  defaultProvider:string;
  networkdId:string;
}

export const ContractAddresses = {
  80001: '0x395bE7b1443b6c3Ce5177b2300E5cc20bF22576E',
  1: ''
};

export const environment:{[key:string]:IEnvironment} = {
  test: {
    bouncerURL: 'http://localhost:3000',
    bouncerRPCURL: 'http://localhost:3000/spkz/rpc',
    defaultProvider: 'https://speedy-nodes-nyc.moralis.io/337ce5317ffe1f66093a6c3b/polygon/mumbai',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  dev: {
    bouncerURL: 'https://dev.bouncer.spkz.io',
    bouncerRPCURL: 'https://dev.bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'https://speedy-nodes-nyc.moralis.io/337ce5317ffe1f66093a6c3b/polygon/mumbai',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  uat: {
    bouncerURL: 'https://dev.bouncer.spkz.io',
    bouncerRPCURL: 'https://uat.bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'https://speedy-nodes-nyc.moralis.io/337ce5317ffe1f66093a6c3b/polygon/mumbai',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  prod: {
    bouncerURL: 'https://bouncer.spkz.io',
    bouncerRPCURL: 'https://bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'https://speedy-nodes-nyc.moralis.io/337ce5317ffe1f66093a6c3b/polygon/mainnet',
    roomContractAddress: '',
    chainId: '137',
    networkdId: '1'
  }
};
