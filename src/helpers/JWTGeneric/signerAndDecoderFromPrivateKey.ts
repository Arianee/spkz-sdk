import Web3 from 'web3';
import { JWTGeneric } from './JWTGeneric';

export const decoder = (message, signature) => new Web3().eth.accounts.recover(message, signature);
const signerFactory = (privateKey) => (data) => new Web3().eth.accounts.sign(data, privateKey).signature;

export const signerDecoder = (privateKey:string) => {
  const address = new Web3().eth.accounts.privateKeyToAccount(privateKey).address;
  const signer = signerFactory(privateKey);
  return { signer, decoder, address };
};

export const JWTDecoder = (token) => {
  const decoder = (message, signature) => new Web3().eth.accounts.recover(message, signature);

  return new JWTGeneric((data) => data, decoder).setToken(token);
};
