import { IPFSContentType, IPFSService } from './IPFSService';

describe('NFTRoomService', () => {
  test('Ping infura IPFS', async () => {
    const instance = new IPFSService({} as any, {} as any);
    const result = await instance.storeContentOnIPFS({ name: 'my name' }, IPFSContentType.JSON);

    expect(result).toBe('ipfs://QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2');
  });

  describe('fetchOnIPFS', () => {
    test('should fallback on other node until have a reposne', async () => {
      const fetchMock = jest.fn();
      const instance = new IPFSService({} as any, { fetch: fetchMock } as any);

      let callCount = 0;
      fetchMock.mockImplementation(() => {
        callCount++;
        if (callCount > 1) {
          return Promise.resolve({ name: 'my name' });
        } else {
          return Promise.reject('error');
        }
      });

      await instance.fetchOnIPFS('QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2');

      expect(fetchMock).toHaveBeenCalledTimes(2);
      //
    });

    test('should throw error if no gateway responses', async () => {
      const fetchMock = jest.fn();
      const instance = new IPFSService({} as any, { fetch: fetchMock } as any);

      fetchMock.mockImplementation(() => Promise.reject('error'));

      await expect(instance.fetchOnIPFS('QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2'))
        .rejects.toThrow();

      expect(fetchMock).toHaveBeenCalledTimes(instance.ipfsProviders.length);
    });
  });
});
