import { getNetworkInfo } from './networkInfos.helper';
import axios from 'axios';

jest.mock('axios');
const axiosMock: jest.Mock = (axios as any);
const Web3 = require('web3');

describe('getNetworkInfo', function () {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('it should return network info', () => {
    test('it should return network info if network is known', async () => {
      axiosMock.mockImplementation(() => Promise.resolve({
        data: [{
          name: 'Matic(Polygon) Mainnet',
          chain: 'Matic(Polygon)',
          network: 'mainnet',
          rpc: ['https://rpc-mainnet.matic.network', 'wss://ws-mainnet.matic.network', 'https://rpc-mainnet.matic.quiknode.pro', 'https://matic-mainnet.chainstacklabs.com'],
          faucets: [],
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
          },
          infoURL: 'https://matic.network/',
          shortName: 'matic',
          chainId: 137,
          networkId: 137,
          explorers: [{
            name: 'polygonscan',
            url: 'https://polygonscan.com',
            standard: 'EIP3091'
          }]
        }]
      })
      );

      const result = await getNetworkInfo(137);

      expect(result.name).toBe('Matic(Polygon) Mainnet');
      expect(result.chain).toBe('Matic(Polygon)');
      expect(result.chainId).toBe(137);
      expect(result.explorers).toMatchObject([{
        name: 'polygonscan',
        url: 'https://polygonscan.com',
        standard: 'EIP3091'
      }]);
      expect(result.faucets).toMatchObject([]);
      expect(result.infoURL).toBe('https://matic.network/');
      expect(result.nativeCurrency).toMatchObject({
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18
      });
      expect(result.network).toBe('mainnet');
      expect(result.networkId).toBe(137);
      expect(result.rpc).toMatchObject(['https://rpc-mainnet.matic.network', 'wss://ws-mainnet.matic.network', 'https://rpc-mainnet.matic.quiknode.pro', 'https://matic-mainnet.chainstacklabs.com']);
      expect(result.shortName).toBe('matic');
    });
    test('it should return error if network is unknown', async () => {
      axiosMock.mockImplementation(() => Promise.resolve({
        data: [{
          name: 'Matic(Polygon) Mainnet',
          chain: 'Matic(Polygon)',
          network: 'mainnet',
          rpc: ['https://rpc-mainnet.matic.network', 'wss://ws-mainnet.matic.network', 'https://rpc-mainnet.matic.quiknode.pro', 'https://matic-mainnet.chainstacklabs.com'],
          faucets: [],
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18
          },
          infoURL: 'https://matic.network/',
          shortName: 'matic',
          chainId: 137,
          networkId: 137,
          explorers: [{
            name: 'polygonscan',
            url: 'https://polygonscan.com',
            standard: 'EIP3091'
          }]
        }]
      })
      );
      try {
        const result = await getNetworkInfo(82);
        expect(false).toBe(true);
      } catch (e) {
        expect(e.message).toBe('Chain not found');
      }
    });
  });
})
;
