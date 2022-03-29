import { Strategy } from '../../models/strategy';
import { ERC1155BalanceOfBatchSchema, ERC1155BalanceOfSchema, ERC20BalanceOfSchema, ERC20BalancesOfSchema, ERC721BalancesOfSchema, ERC721BalancesOfIssuedBySchema, IsExactAddressesSchema, PoapHolderOfSchema, StrategySchema, StrategySchemaReturn, UnlockHasOwnershipSchema, ERC721OwnerOfSchema, ERC721NotOwnerOfSchema } from '../../models/strategySchemas';

export const validateStrategy = (strategy: Strategy) : { valid: boolean, details: StrategySchemaReturn[] } => {
  const schema = getSchemaForStrategy(strategy);

  // If no schema, assume the strategy is valid (foreign strategy)
  if (!schema) return { valid: true, details: [] };

  const details : StrategySchemaReturn[] = [];

  Object
    .keys(schema)
    .forEach(key => {
      const propValidation = schema[key](strategy.params[key]);
      if (!propValidation.valid) details.push(propValidation);
    });

  const valid = details.length === 0;

  return {
    valid,
    details
  };
};

export const validateSubstrategy = (substrategyName, substrategy) : { valid: boolean, details: StrategySchemaReturn[] } => {
  return validateStrategy({
    name: substrategyName,
    params: substrategy
  });
};

const getSchemaForStrategy = (strategy: Strategy) : StrategySchema<any> | null => {
  switch (strategy.name) {
    // For some reasons, we've been using this name for ERC20BalancesOf (with a s)
    case 'erc-20-balance-of':
      return ERC20BalancesOfSchema;
    case 'erc-721-balance-of':
      return ERC721BalancesOfSchema;
    case 'erc-721-balance-of-issued-by':
      return ERC721BalancesOfIssuedBySchema;
    case 'erc-20-balance-of-substrategy':
      return ERC20BalanceOfSchema;
    case 'poap-holder-of':
      return PoapHolderOfSchema;
    case 'unlock-has-membership':
      return UnlockHasOwnershipSchema;
    case 'is-exact-address':
      return IsExactAddressesSchema;
    case 'erc-1155-balance-of-batch':
      return ERC1155BalanceOfBatchSchema;
    case 'erc-1155-balance-of-substrategy':
      return ERC1155BalanceOfSchema;
    case 'erc-721-owner-of':
      return ERC721OwnerOfSchema;
    case 'erc-721-not-owner-of':
      return ERC721NotOwnerOfSchema;
    default:
      return null;
  }
};
