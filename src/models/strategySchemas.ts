import { validateSubstrategy } from '../helpers/validateStrategy/validateStrategy.helper';
import { ERC20BalanceOf, ERC20BalancesOf, ERC721BalancesOf, isExactAddresses, PoapHolderOf, UnlockHasOwnership, ERC1155BalanceOfBatch, ERC1155BalanceOf } from './strategy';
import * as validators from '../helpers/validateStrategy/utils/validators';

export type StrategySchema<T> = {
    [K in keyof T]: (value: any) => StrategySchemaReturn;
};

export interface StrategySchemaReturn {
    key: string;
    valid: boolean;
    description: string;
}

export const ERC20BalancesOfSchema : StrategySchema<ERC20BalancesOf> = {
  minBalance: value => ({
    key: 'minBalance',
    valid: validators.isMinBalance(value),
    description: 'Min balance must be a number'
  }),
  tokens: value => {
    const tokensValidations = validators.isArray(value) ? value.map(token => validateSubstrategy('erc-20-balance-of-substrategy', token)) : [];
    const valid = validators.isArray(value) && tokensValidations.length > 0 && tokensValidations.every(validation => validation.valid);
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
    valid: validators.isNotSet(value) || validators.isURL(value),
    description: 'Logo must be a valid URL'
  })
};

export const ERC20BalanceOfSchema : StrategySchema<ERC20BalanceOf> = {
  chainId: value => ({
    key: 'chainId',
    valid: validators.isChainId(value),
    description: 'Chain ID must be a number'
  }),
  networkId: value => ({
    key: 'networkId',
    valid: validators.isNotSet(value) || validators.isNetworkId(value),
    description: 'Network ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: validators.isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  })
};

export const ERC721BalancesOfSchema : StrategySchema<ERC721BalancesOf> = {
  minBalance: value => ({
    key: 'minBalance',
    valid: validators.isMinBalance(value),
    description: 'Min balance must be a number'
  }),
  tokens: value => {
    const tokensValidations = validators.isArray(value) ? value.map(token => validateSubstrategy('erc-20-balance-of-substrategy', token)) : [];
    const valid = validators.isArray(value) && tokensValidations.length > 0 && tokensValidations.every(validation => validation.valid);
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
    valid: validators.isNotSet(value) || validators.isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Symbol must be a string'
  })
};

export const ERC1155BalanceOfBatchSchema : StrategySchema<ERC1155BalanceOfBatch> = {
  chainId: value => ({
    key: 'chainId',
    valid: validators.isChainId(value),
    description: 'Chain ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: validators.isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  }),
  logo: value => ({
    key: 'logo',
    valid: validators.isNotSet(value) || validators.isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Symbol must be a string'
  }),
  minBalances: value => {
    const balancesValidations = validators.isArray(value) ? value.map(balance => validateSubstrategy('erc-1155-balance-of-substrategy', balance)) : [];
    const valid = validators.isArray(value) && balancesValidations.length > 0 && balancesValidations.every(validation => validation.valid);
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
    valid: validators.isTokenId(value),
    description: 'ID must be a number'
  }),
  amount: value => ({
    key: 'amount',
    valid: validators.isMinBalance(value),
    description: 'Amount must be a number'
  })
};

export const PoapHolderOfSchema : StrategySchema<PoapHolderOf> = {
  eventId: value => ({
    key: 'eventId',
    valid: validators.isEventId(value),
    description: 'Event ID must be a number'
  }),
  logo: value => ({
    key: 'logo',
    valid: validators.isNotSet(value) || validators.isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Symbol must be a string'
  })
};

export const UnlockHasOwnershipSchema : StrategySchema<UnlockHasOwnership> = {
  chainId: value => ({
    key: 'chainId',
    valid: validators.isChainId(value),
    description: 'Chain ID must be a number'
  }),
  address: value => ({
    key: 'address',
    valid: validators.isEthereumAddress(value),
    description: 'Address must be a valid Ethereum address'
  }),
  logo: value => ({
    key: 'logo',
    valid: validators.isNotSet(value) || validators.isURL(value),
    description: 'Logo must be a valid URL'
  }),
  name: value => ({
    key: 'name',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Name must be a string'
  }),
  symbol: value => ({
    key: 'symbol',
    valid: validators.isNotSet(value) || validators.isString(value),
    description: 'Symbol must be a string'
  })
};

export const IsExactAddressesSchema : StrategySchema<isExactAddresses> = {
  addresses: value => ({
    key: 'addresses',
    valid: validators.isArray(value) && validators.minLength(value, 1) && value.every(address => validators.isEthereumAddress(address)),
    description: 'Addresses must contain at least one valid Ethereum address'
  })
};
