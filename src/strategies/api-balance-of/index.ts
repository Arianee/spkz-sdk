/**
 * Strategy: api-balance-of
 * Parameters:
 * - url: the url to be fetched (GET), MUST return an array
 * - minBalance: the min size of the array returned by the url
 * - maxBalance (optional): the max size of the array returned by the url
 * - headers: optional, headers to pass to the GET request
 *
 * Strategy is authorized if the size of the array returned by the url satisfies: minBalance <= size <= maxBalance
 * Note: all occurrences of __ADDRESS__ in url will be replaced by the first address
 * of the addresses array of the strategy (Strategy.addresses[0]).
 *
 */
import { requiredDefined } from '@arianee/required';
import axios from 'axios';
import { ErrorCode } from '../../models/errorCode';
import { ApiBalanceOf, Strategy } from '../../models/strategy';
import { StrategyReturnPromise } from '../../models/strategyReturn';

const ADDRESS_PARAM_REGEX = /__ADDRESS__/g;

export const replaceAddressOccurrencesInEndpoint = (endpoint: string, _strategy: Strategy<ApiBalanceOf>) => {
  if (!_strategy.addresses || _strategy.addresses.length === 0) return endpoint;
  return endpoint.replace(ADDRESS_PARAM_REGEX, _strategy.addresses[0]);
};

export const getArrayFromEndpoint = async (endpoint: string, headers: ApiBalanceOf['headers']) : Promise<any[]> => {
  const maybeArray = await (await axios.get(endpoint, { headers })).data;
  if (!Array.isArray(maybeArray)) throw new Error('The endpoint did not return an array');

  return maybeArray;
};

export const arrayLengthIsWithin = (array: any[], minLength: number, maxLength: number = Infinity) : boolean => {
  return minLength <= array.length && array.length <= maxLength;
};

export const validateStrategy = (_strategy: Strategy<ApiBalanceOf>) : void => {
  const { params } = _strategy;

  requiredDefined(params.headers, 'headers is required');
  requiredDefined(params.minBalance, 'minBalance is required');
  requiredDefined(params.url, 'url is required');
};

export const strategy = async (_strategy: Strategy<ApiBalanceOf>): StrategyReturnPromise => {
  try {
    validateStrategy(_strategy);
  } catch {
    return {
      strategy: _strategy,
      isAuthorized: false,
      code: ErrorCode.ERRORINSTRATEGY,
      message: 'Invalid params'
    };
  }

  const { url, headers, minBalance, maxBalance } = _strategy.params;

  let isAuthorized = false;
  let message;
  let code: ErrorCode;
  try {
    const replacedEndpoint = replaceAddressOccurrencesInEndpoint(url, _strategy);
    const array = await getArrayFromEndpoint(replacedEndpoint, headers);
    isAuthorized = arrayLengthIsWithin(array, minBalance, maxBalance);
    code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;
    message = isAuthorized ? null : `Api returned an array whose length was outside of [${minBalance}, ${maxBalance ? maxBalance + ']' : 'Infinity['}`;
  } catch (e) {
    message = e?.message;
    code = ErrorCode.ERRORINSTRATEGY;
  }

  return {
    strategy: _strategy,
    isAuthorized,
    code,
    message
  };
};
