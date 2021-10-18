import BigNumber from 'bignumber.js';
import assert from 'assert';

export const veryVerySmallAmout = (amount:string, decimals:string, decimalToDisplay:string = '4') => {
  assert(+decimals >= 0, 'decimals is required');

  const bnDecimals = new BigNumber(10).pow(new BigNumber(decimals));

  const amountWithDecimals = new BigNumber(amount);
  const amountWithoutDecimals = amountWithDecimals
    .div(bnDecimals);

  if (amountWithoutDecimals.isZero()) {
    return '0';
  };

  const decimalsToDisplay = new BigNumber(decimals).minus(new BigNumber(decimalToDisplay));
  const minAmountToNotBeASmallAmount = new BigNumber(10)
    .pow(decimalsToDisplay);

  const isVeryVerySmallAmount = amountWithDecimals
    .isLessThan(minAmountToNotBeASmallAmount);

  const amountToDisplay = new Intl.NumberFormat('en').format(+amountWithoutDecimals.toFixed());
  return isVeryVerySmallAmount ? 'a very little bit of' : amountToDisplay;
};

export const minMaxMessage = (params: {
    decimals,
    balance,
    symbol,
    amountRequired,
}) => {
  const {
    decimals,
    balance,
    symbol,
    amountRequired
  } = params;

  const defaultDecimal = decimals || 0;

  return `You have ${veryVerySmallAmout(balance, defaultDecimal)} ${symbol}. You need ${veryVerySmallAmout(amountRequired, defaultDecimal)} ${symbol}`;
};
