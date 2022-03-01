import { validateSubstrategy } from '../helpers/validateStrategy/validateStrategy.helper';
import Web3 from 'web3';
import { ERC20BalanceOf, ERC20BalancesOf, ERC721BalancesOf, isExactAddresses, PoapHolderOf, UnlockHasOwnership, ERC1155BalanceOfBatch, ERC1155BalanceOf } from './strategy';

export type StrategySchema<T> = {
    [K in keyof T]: (value: any) => StrategySchemaReturn;
};

export interface StrategySchemaReturn {
    key: string;
    valid: boolean;
    description: string;
}

const isUndefined = value => value === undefined;
const isNull = value => value === null;
const isString = value => typeof value === 'string';
const isEthereumAddress = value => Web3.utils.isAddress(value);
const minLength = (value, min) => value.length >= min;
const maxLength = (value, max) => value.length <= max;
const onlyNumericChars = value => /[0-9]+/.test(value);
const isURL = value => {
  try {
    return !!(new URL(value));
  } catch {
    return false;
  }
};
const isArray = value => Array.isArray(value);

const isChainId = value => isString(value) && minLength(value, 1) && onlyNumericChars(value);
const isNetworkId = value => isChainId(value);
const isEventId = value => isChainId(value);
const isTokenId = value => isChainId(value);
const isMinBalance = value => isString(value) && minLength(value, 1) && onlyNumericChars(value);
const isNotSet = value => isUndefined(value) || isNull(value) || (isString(value) && value === '');

export const ERC20BalancesOfSchema : StrategySchema<ERC20BalancesOf> = {
  minBalance: value => ({
    key: 'minBalance',
    valid: isMinBalance(value),
    description: 'Min balance must be a number'
  }),
  tokens: value => {
    const tokensValidations = isArray(value) ? value.map(token => validateSubstrategy('erc-20-balance-of-substrategy', token)) : [];
    const valid = isArray(value) && tokensValidations.length > 0 && tokensValidations.every(validation => validation.valid);
    let description = 'Error in tokens';
    tokensValidations.forEach(validation => {
      description += validation.details.map(detail => '<br/>- ' + detail.description).join('');
    });

    return {
      key: 'tokens',
      valid,
      description
    };
  },
  logo: value => ({
    key: 'logo',
    valid: isNotSet(value) || isURL(value),
    description: 'Logo must be a valid URL'
  })
};

export const ERC20BalanceOfSchema : StrategySchema<ERC20BalanceOf> = {
  chainId: value => ({
    key: 'chainId',
    valid: isChainId(value),
    description: 'Chain ID must be a number'
  }),
  networkId: value => ({
    key: 'networkId',
    valid: isNotSet(value) || isNetworkId(value),
    description: 'Network ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  })
};

export const ERC721BalancesOfSchema : StrategySchema<ERC721BalancesOf> = {
  minBalance: value => ({
    key: 'minBalance',
    valid: isMinBalance(value),
    description: 'Min balance must be a number'
  }),
  tokens: value => {
    const tokensValidations = isArray(value) ? value.map(token => validateSubstrategy('erc-20-balance-of-substrategy', token)) : [];
    const valid = isArray(value) && tokensValidations.length > 0 && tokensValidations.every(validation => validation.valid);
    let description = 'Error in tokens';
    tokensValidations.forEach(validation => {
      description += validation.details.map(detail => '<br/>- ' + detail.description).join('');
    });

    return {
      key: 'tokens',
      valid,
      description
    };
  },
  logo: value => ({
    key: 'logo',
    valid: isNotSet(value) || isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: isNotSet(value) || isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: isNotSet(value) || isString(value),
    description: 'Symbol must be a string'
  })
};

export const ERC1155BalanceOfBatchSchema : StrategySchema<ERC1155BalanceOfBatch> = {
  chainId: value => ({
    key: 'chainId',
    valid: isChainId(value),
    description: 'Chain ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  }),
  logo: value => ({
    key: 'logo',
    valid: isNotSet(value) || isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: isNotSet(value) || isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: isNotSet(value) || isString(value),
    description: 'Symbol must be a string'
  }),
  minBalances: value => {
    const balancesValidations = isArray(value) ? value.map(balance => validateSubstrategy('erc-1155-balance-of-substrategy', balance)) : [];
    const valid = isArray(value) && balancesValidations.length > 0 && balancesValidations.every(validation => validation.valid);
    let description = 'Error in tokens';
    if (balancesValidations.length === 0) description += '<br/>- There must be at least 1 token';
    balancesValidations.forEach(validation => {
      description += validation.details.map(detail => '<br/>- ' + detail.description).join('');
    });

    return {
      key: 'minBalances',
      valid,
      description
    };
  }
};

export const ERC1155BalanceOfSchema : StrategySchema<ERC1155BalanceOf> = {
  id: value => ({
    key: 'id',
    valid: isTokenId(value),
    description: 'ID must be a number'
  }),
  amount: value => ({
    key: 'amount',
    valid: isMinBalance(value),
    description: 'Amount must be a number'
  })
};

export const PoapHolderOfSchema : StrategySchema<PoapHolderOf> = {
  eventId: value => ({
    key: 'eventId',
    valid: isEventId(value),
    description: 'Event ID must be a number'
  }),
  logo: value => ({
    key: 'logo',
    valid: isNotSet(value) || isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: isNotSet(value) || isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: isNotSet(value) || isString(value),
    description: 'Symbol must be a string'
  })
};

export const UnlockHasOwnershipSchema : StrategySchema<UnlockHasOwnership> = {
  chainId: value => ({
    key: 'chainId',
    valid: isChainId(value),
    description: 'Chain ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  }),
  logo: value => ({
    key: 'logo',
    valid: isNotSet(value) || isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: isNotSet(value) || isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: isNotSet(value) || isString(value),
    description: 'Symbol must be a string'
  })
};

export const IsExactAddressesSchema : StrategySchema<isExactAddresses> = {
  addresses: value => ({
    key: 'addresses',
    valid: isArray(value) && minLength(value, 1) && value.every(address => isEthereumAddress(address)),
    description: 'Addresses must contain at least one valid Ethereum address'
  })
};
