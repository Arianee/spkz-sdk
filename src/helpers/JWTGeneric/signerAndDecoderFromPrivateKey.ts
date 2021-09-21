import Web3 from 'web3';

export const signerDecoder = (privateKey:string) => {
  const address = new Web3().eth.accounts.privateKeyToAccount(privateKey).address;

  const signer = (data) => new Web3().eth.accounts.sign(data, privateKey).signature;
  const decoder = (message, signature) => new Web3().eth.accounts.recover(message, signature);
  return { signer, decoder, address };
};
