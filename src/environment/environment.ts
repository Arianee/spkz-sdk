
export interface IEnvironment{
  bouncerRPCURL:string;
  bouncerURL:string;
  roomContractAddress:string;
  chainId:string;
  defaultProvider:string;
  networkdId:string;
}

export const ContractAddresses = {
  80001: '0x56c35dF413b3cd753f85427e55A8dF66A79f1bd7',
  137: '0xd429262030B75De758Ff807282405fc3b32F8416'
};

export const environment:{[key:string]:IEnvironment} = {
  test: {
    bouncerURL: 'http://localhost:3000',
    bouncerRPCURL: 'http://localhost:3000/spkz/rpc',
    defaultProvider: 'http://mumbai.arianee.net',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  dev: {
    bouncerURL: 'https://dev.bouncer.spkz.io',
    bouncerRPCURL: 'https://dev.bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'http://mumbai.arianee.net',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  uat: {
    bouncerURL: 'https://uat.bouncer.spkz.io',
    bouncerRPCURL: 'https://uat.bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'http://mumbai.arianee.net',
    roomContractAddress: ContractAddresses['80001'],
    chainId: '80001',
    networkdId: '80001'
  },
  prod: {
    bouncerURL: 'https://bouncer.spkz.io',
    bouncerRPCURL: 'https://bouncer.spkz.io/spkz/rpc',
    defaultProvider: 'https://polygon.spkz.io',
    roomContractAddress: ContractAddresses['137'],
    chainId: '137',
    networkdId: '1'
  }
};
