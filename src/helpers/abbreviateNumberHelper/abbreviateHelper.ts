import { abbreviate } from '@pqt/abbreviate';

export const abbreviateStringNumber = (num:string):string => {
  const numbersSplitted = num.split('.');
  const smallNumber = numbersSplitted[0] === '0';

  if (smallNumber) {
    const numToNumber = +num;
    const isTooSmall = numToNumber < 0.0001;
    const roundedNumber = (Math.round(numToNumber * 1000) / 1000).toString();
    return isTooSmall ? 'few' : roundedNumber;
  } else {
    return abbreviate(+num, 4);
  }
};
