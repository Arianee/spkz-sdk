import { executeStrategiesWithCache } from '../executeStrategy';

jest.setTimeout(60000);

xdescribe('unlock has membership', () => {
  test('should return true if at least one address has a KEY for the Lock contract', async () => {
    const lockContract = '0xF5809C0983b1821E9B428Cf25448ADaE27715A13';
    const addressWithKey = '0x20797F3D8b051f444Ed9968d34B0a6B1aF9c01d4';

    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'unlock-has-membership',
        addresses: [
          addressWithKey,
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'],
        params: {
          chainId: '1',
          address: lockContract
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );

    expect(strategyProvider.isAuthorized).toBeTruthy();
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.name).toBeDefined();
  });

  test('should return false if no address has a KEY for the Lock contract', async () => {
    const lockContract = '0xF5809C0983b1821E9B428Cf25448ADaE27715A13';

    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'unlock-has-membership',
        addresses: [
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'],
        params: {
          chainId: '4',
          address: lockContract
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );

    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.name).toBeDefined();
  });

  test('should return false if contract is not a Lock contract', async () => {
    const strategyProvider = await executeStrategiesWithCache([[
      {
        name: 'unlock-has-membership',
        addresses: [
          '0x9cE08276311e4c620Fb5b4DDb4b5156EED3fD743',
          '0x0F59576DE893Fb93Dd25d6a4fc6dB088FB2347D2'
        ],
        params: {
          chainId: '4',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
        }
      }
    ]], { tokenId: '0', chainId: '80001' }
    );

    expect(strategyProvider.isAuthorized).toBeFalsy();
    expect(strategyProvider.strategies[0][0].code).toBe(4);
  });
});
