import { executeStrategiesWithCache } from '../executeStrategy';
jest.setTimeout(60000);

describe('execute strategies of erc 721 balance of', () => {
  test('wallet without erc 721 should be not authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xF0245F6251Bef9447A08766b9DA2B07b28aD80B0'],
        params: {
          // Have 1 visitor
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(1);

    expect(strategyProvider.isAuthorized).toBeFalsy();
  });

  test('wallet with erc 721 should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108'],
        params: {
          // Have 1 visitor
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with erc 721 should be authorized (ENS)', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          // Have 1 visitor
          minBalance: '1',
          name: 'Ethereum Name Service',
          symbol: 'ENS',
          logo: 'MYLOGO',
          tokens: [{
            address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
            chainId: '1',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });
    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].enrichedInformations.name).toBe('Ethereum Name Service');
    expect(strategyProvider.strategies[0][0].enrichedInformations.symbol).toBe('ENS');
    expect(strategyProvider.strategies[0][0].enrichedInformations.logo).toBe('MYLOGO');

    expect(strategyProvider.strategies[0][0].code).toBe(0);

    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with balanceOf 2 different erc721 >= 2 should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          // Have 1 visitor and/or 1 PolyDoge X QuickSwap (PDQuick) (sum >= 2)
          minBalance: '2',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          },
          {
            address: '0xe59fd80c8cb160ca490414c6069de003328148df',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });

  test('wallet with 2 different erc 721 should be authorized', async () => {
    const strategyProvider = await executeStrategiesWithCache([
      [{
        // Have 1 visitor and 1 PolyDoge X QuickSwap (PDQuick)

        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          minBalance: '1',
          tokens: [
            {
              address: '0xe59fd80c8cb160ca490414c6069de003328148df',
              chainId: '137',
              networkId: '1'
            }]
        }
      },
      {
        name: 'erc-721-balance-of',
        addresses: ['0xeFeA1123d4Ed5d342f429049Aa014bF628d10108', '0x5BC8da7dE68c1af47D329B14ADdBf1d7547A1747'],
        params: {
          minBalance: '1',
          tokens: [{
            address: '0x0a0bf65248805efa926c39bf51b6dd94e3d1a7af',
            chainId: '137',
            networkId: '1'
          }]
        }
      }]
    ], { tokenId: '0', chainId: '80001' });

    expect(strategyProvider.strategies[0][0].message).toBeDefined();
    expect(strategyProvider.strategies[0][0].code).toBe(0);
    expect(strategyProvider.isAuthorized).toBeTruthy();
  });
});
