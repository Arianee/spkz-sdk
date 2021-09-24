import Web3 from 'web3';

export const sumBN = (numbers:string[]):string => {
  let sum = Web3.utils.toBN('0');

  numbers.forEach(number => {
    sum = sum.add(Web3.utils.toBN(number));
  });

  return sum.toString();
};
