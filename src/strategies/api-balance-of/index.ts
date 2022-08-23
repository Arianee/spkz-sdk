import { requiredDefined } from '@arianee/required';
import axios from 'axios';
import { ErrorCode } from '../../models/errorCode';
import { ApiBalanceOf, Strategy } from '../../models/strategy';
import { StrategyReturnPromise } from '../../models/strategyReturn';

export const getArrayFromEndpoint = async (endpoint: string, headers: ApiBalanceOf['headers']) : Promise<any[]> => {
  const maybeArray = await (await axios.get(endpoint, { headers })).data;
  if (!Array.isArray(maybeArray)) throw new Error('The endpoint did not return an array');

  return maybeArray;
};

export const arrayLengthIsGreaterThan = (array: any[], minLength: number) : boolean => {
  return array.length >= minLength;
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

  const { url, headers, minBalance } = _strategy.params;

  let isAuthorized = false;
  let message;
  let code: ErrorCode;
  try {
    const array = await getArrayFromEndpoint(url, headers);
    isAuthorized = arrayLengthIsGreaterThan(array, minBalance);
    code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;
    message = isAuthorized ? null : 'Api returned an array whose length is less than min balance';
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
