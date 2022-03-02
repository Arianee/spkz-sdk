import Web3 from 'web3';

export const isUndefined = value => value === undefined;
export const isNull = value => value === null;
export const isString = value => typeof value === 'string';
export const isEthereumAddress = value => Web3.utils.isAddress(value);
export const minLength = (value, min) => value.length >= min;
export const maxLength = (value, max) => value.length <= max;
export const onlyNumericChars = value => /^[0-9]+$/.test(value);
export const isURL = value => {
  try {
    return !!(new URL(value));
  } catch {
    return false;
  }
};
export const isArray = value => Array.isArray(value);

export const isChainId = value => isString(value) && minLength(value, 1) && onlyNumericChars(value);
export const isNetworkId = value => isChainId(value);
export const isEventId = value => isChainId(value);
export const isTokenId = value => isChainId(value);
export const isMinBalance = value => isString(value) && minLength(value, 1) && onlyNumericChars(value);
export const isNotSet = value => isUndefined(value) || isNull(value) || (isString(value) && value === '');
