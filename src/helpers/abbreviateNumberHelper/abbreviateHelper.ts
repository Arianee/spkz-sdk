import { abbreviate } from '@pqt/abbreviate';
import BigNumber from 'bignumber.js';

export const abbreviateStringNumber = (num:string):string => {
  const numbersSplitted = num.split('.');
  const smallNumber = numbersSplitted[0] === '0';

  if (smallNumber) {
    const numToNumber = +num;
    const isTooSmall = numToNumber < 0.0001 && numToNumber > 0;
    const roundedNumber = (Math.round(numToNumber * 1000) / 1000).toString();
    return isTooSmall ? 'few' : roundedNumber;
  } else {
    const roundedNumber = Math.round(+num * 1000) / 1000;
    return abbreviate(roundedNumber, 1);
  }
};

export const abbreviateTokenBN = (num:string, decimals:string):{
  abbreviated:string,
  withoutDecimals:string,
  withDecimals:string} => {
  const amountWithDecimals = new BigNumber(num);
  const bnDecimals = new BigNumber(10).pow(new BigNumber(decimals));

  const bnWithoutDecimals = amountWithDecimals
    .div(bnDecimals)
    .toFixed();

  const abbreviated:string = abbreviateStringNumber(bnWithoutDecimals);

  return {
    abbreviated,
    withoutDecimals: bnWithoutDecimals,
    withDecimals: num
  };
};
