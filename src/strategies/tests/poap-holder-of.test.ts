import { executeStrategiesWithCache } from '../executeStrategy';

jest.setTimeout(60000);

describe('poap holder of', () => {
  xtest('should return true if one address attended POAP', async () => {
    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'poap-holder-of',
        addresses: [
          '0xce7e15acf3da916a4df4842c3350248ad74ffc79',
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'],
        params: {
          eventId: '14629'
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );
    expect(strategyProvider.isAuthorized).toBeTruthy();
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
  });
  xtest('should return false if no addresses attended POAP', async () => {
    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'poap-holder-of',
        addresses: [
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'
        ],
        params: {
          eventId: '14629'
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );
    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
  });

  test('should return false if eventId does not exist', async () => {
    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'poap-holder-of',
        addresses: [
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'
        ],
        params: {
          eventId: 'aaaa'
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );
    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].code).toBe(4);
  });
});
