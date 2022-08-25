import { Strategy, ApiBalanceOf } from '../../models/strategy';
import { executeStrategies, executeStrategiesWithCache } from '../executeStrategy';
import { arrayLengthIsGreaterThan, getArrayFromEndpoint, replaceAddressOccurrencesInEndpoint, validateStrategy } from '../api-balance-of/index';
import axios from 'axios';
import { ErrorCode } from '../../models/errorCode';

jest.setTimeout(60000);
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getArrayFromEndpoint', () => {
  it('should pass the endpoint and headers to axios', async () => {
    const endpoint = 'https://notanarray.com/';
    const headers = {
      'x-api-key': 'abcd-efgh'
    };

    const array = ['a', 'b'];
    mockedAxios.get.mockResolvedValue({
      data: array
    });

    await getArrayFromEndpoint(endpoint, headers);
    expect(mockedAxios.get).toHaveBeenCalledWith(endpoint, { headers });
  });

  it('should throw if the endpoint does not return an array', async () => {
    const endpoint = 'https://notanarray.com/';
    const headers = {};

    mockedAxios.get.mockResolvedValue({
      data: 'not an array'
    });

    expect(getArrayFromEndpoint(endpoint, headers)).rejects.toThrowError();
  });

  it('should return the endpoint\'s array', async () => {
    const endpoint = 'https://anarray.com/';
    const headers = {};

    const array = ['a', 'b'];
    mockedAxios.get.mockResolvedValue({
      data: array
    });

    expect(getArrayFromEndpoint(endpoint, headers)).resolves.toEqual(array);
  });
});

describe('arrayLengthIsGreaterThan', () => {
  it('should return true if the array length is greater than or equal to minLength', () => {
    expect(arrayLengthIsGreaterThan(['a', 'b'], 1)).toBeTruthy();
    expect(arrayLengthIsGreaterThan(['a', 'b'], 2)).toBeTruthy();
  });
  it('should return false if the array length is lower than minLength', () => {
    expect(arrayLengthIsGreaterThan(['a', 'b'], 154151)).toBeFalsy();
  });
});

describe('replaceAddressOccurrencesInEndpoint', () => {
  it('should return a new string with __ADDRESS__ replaced by strategy.addresses[0]', () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef', '0xghijkl'],
      params: {
        url: 'https://arianee.org/?address=__ADDRESS__',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    expect(replaceAddressOccurrencesInEndpoint(strategy.params!.url, strategy)).toEqual('https://arianee.org/?address=' + strategy.addresses![0]);
  });

  it('should return the original string if no __ADDRESS__ occurrence in the url', () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef', '0xghijkl'],
      params: {
        url: 'https://arianee.org/',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    expect(replaceAddressOccurrencesInEndpoint(strategy.params!.url, strategy)).toEqual('https://arianee.org/');
  });

  it('should return the original string if addresses is not defined or of length 0', () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: [],
      params: {
        url: 'https://arianee.org/',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    expect(replaceAddressOccurrencesInEndpoint(strategy.params!.url, strategy)).toEqual('https://arianee.org/');
    delete strategy.addresses;
    expect(replaceAddressOccurrencesInEndpoint(strategy.params!.url, strategy)).toEqual('https://arianee.org/');
  });
});

describe('validateStrategy', () => {
  it('should throw if the strategy params are not valid', () => {
    for (const param of ['url', 'headers', 'minBalance']) {
      const strategy : Strategy<ApiBalanceOf> = {
        name: 'api-balance-of',
        addresses: ['0xabcdef'],
        params: {
          url: 'https://arianee.org',
          headers: { Authorization: 'Basic 123' },
          minBalance: 1
        }
      };

      // @ts-ignore
      delete strategy.params[param];

      expect(() => validateStrategy(strategy)).toThrow();
    }
  });

  it('should not throw if the strategy params are  valid', () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef'],
      params: {
        url: 'https://arianee.org',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    expect(() => validateStrategy(strategy)).not.toThrow();
  });
});

describe('Execute api-balance-of strategies', () => {
  it('should authorize if the strategy\'s url returns an array whose length is more than the min balance', async () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef'],
      params: {
        url: 'https://arianee.org',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    mockedAxios.get.mockResolvedValue({
      data: ['a', 'b', 'c']
    });

    const strategiesReturn = await executeStrategies([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe(null);
    expect(strategiesReturn.strategies[0][0].code).toBe(ErrorCode.SUCCESS);
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeTruthy();
  });

  it('should not authorize if the strategy\'s url returns an array whose length is less than the min balance', async () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef'],
      params: {
        url: 'https://arianee.org',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    mockedAxios.get.mockResolvedValue({
      data: []
    });

    const strategiesReturn = await executeStrategies([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('Api returned an array whose length is less than min balance');
    expect(strategiesReturn.strategies[0][0].code).toBe(ErrorCode.NOTENOUGH);
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });

  it('should not authorize if the strategy\'s url does not return an array', async () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef'],
      params: {
        url: 'https://arianee.org',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    mockedAxios.get.mockResolvedValue({
      data: 'not an array'
    });

    const strategiesReturn = await executeStrategies([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('The endpoint did not return an array');
    expect(strategiesReturn.strategies[0][0].code).toBe(ErrorCode.ERRORINSTRATEGY);
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });

  it('should not authorize if the strategy\'s params are invalid', async () => {
    const strategy : Strategy<ApiBalanceOf> = {
      name: 'api-balance-of',
      addresses: ['0xabcdef'],
      params: {
        url: 'https://arianee.org',
        headers: { Authorization: 'Basic 123' },
        minBalance: 1
      }
    };

    // @ts-ignore
    delete strategy.params?.url;

    const strategiesReturn = await executeStrategies([[strategy]], {
      tokenId: '0',
      chainId: '80001'
    });

    expect(strategiesReturn.strategies[0][0].message).toBe('Invalid params');
    expect(strategiesReturn.strategies[0][0].code).toBe(ErrorCode.ERRORINSTRATEGY);
    expect(strategiesReturn.strategies[0][0].isAuthorized).toBeFalsy();
  });
});
