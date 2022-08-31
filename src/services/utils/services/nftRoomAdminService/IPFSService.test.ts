import axios from 'axios';
import { environment } from '../../../../environment/environment';
import { IPFSContentType, IPFSService } from './IPFSService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('NFTRoomService', () => {
  test('Add json to IPFS', async () => {
    const environmentServiceMock = {
      environment: {
        bouncerURL: environment.test.bouncerURL
      }
    };

    mockedAxios.post.mockResolvedValue(
      { data: { Hash: 'QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2' } }
    );

    const instance = new IPFSService(environmentServiceMock as any, {} as any);

    const data = { name: 'my name' };
    const hash = await instance.storeContentOnIPFS(data, IPFSContentType.JSON);

    expect(hash).toEqual('ipfs://QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      environmentServiceMock.environment.bouncerURL + '/ipfs/add',
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } });
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
