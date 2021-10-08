import { CacheStrategyWrapper } from './cacheStrategyWrapper';

var hash = require('object-hash');

describe('strategy cache wrapper', () => {
  describe('testing of hash', () => {
    test('hash in every sense', () => {
      const hash1 = hash({ b: 2, a: 1 });
      const hash2 = hash({ a: 1, b: 2 });
      expect(hash1).toBe(hash2);
    });
    test('hash in every sense with array', () => {
      const strategies = [
        [
          {
            name: 'erc-20-balance-of',
            addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
            params: {
              minBalance: '0',
              tokens: [
                {
                  chainId: '77',
                  networkId: '1',
                  address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
                },
                {
                  chainId: '1',
                  networkId: '1',
                  address: '0xedf6568618a00c6f0908bf7758a16f76b6e04af9'
                }
              ]
            }
          },
          {
            name: 'is-exact-address',
            addresses: ['0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'],
            params: {
              addresses: [
                '0xb261d59bc5b2ced5c000ecb23783f3054e5fc5d0'
              ]
            }
          }]];
      const hash1 = hash(strategies);
      const hash2 = hash(strategies);
      expect(hash1).toBe(hash2);
    });

    test('hash in every sense with string', () => {
      const hash1 = hash('strategies');
      const hash2 = hash('strategies');
      expect(hash1).toBe(hash2);
    });
  });

  test('should not cache if isAuthorized is false', async () => {
    const functionToCache = (arg1, arg2) => {
      return Promise.resolve({
        isAuthorized: false,
        arg1,
        arg2
      });
    };
    const cacheWrapper = new CacheStrategyWrapper();
    const wrappedFunction = cacheWrapper.create(functionToCache);
    await wrappedFunction(1, 2);
    expect(cacheWrapper.exist(functionToCache, 1, 2)).toBeFalsy();
  });

  test('should not cache if isAuthorized is reject', async () => {
    const functionToCache = (arg1, arg2) => {
      return Promise.reject({
        isAuthorized: true,
        arg1,
        arg2
      });
    };
    const cacheWrapper = new CacheStrategyWrapper();
    const wrappedFunction = cacheWrapper.create(functionToCache);
    let inError = false;
    await wrappedFunction(1, 2).catch(e => {
      inError = true;
    });
    expect(inError).toBeTruthy();
    expect(cacheWrapper.exist(functionToCache, 1, 2)).toBeFalsy();
  });
  test('should cache if isAuthorized is true', async () => {
    const functionToCache = (arg1, arg2) => {
      return Promise.resolve({
        isAuthorized: true,
        arg1,
        arg2
      });
    };
    const cacheWrapper = new CacheStrategyWrapper();
    const wrappedFunction = cacheWrapper.create(functionToCache);
    await wrappedFunction(1, 2);
    expect(cacheWrapper.exist(functionToCache, 1, 2)).toBeTruthy();
  });
});
