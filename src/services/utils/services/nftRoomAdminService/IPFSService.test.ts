import { IPFSContentType, IPFSService } from './IPFSService';

describe('NFTRoomService', () => {
  test('Ping infura IPFS', async () => {
    const instance = new IPFSService({} as any);
    const result = await instance.storeContentOnIPFS({ name: 'my name' }, IPFSContentType.JSON);

    expect(result).toBe(instance.publicGateway('QmXkXp83XuqoGSBxyMYQACyjfP1SWZqeE8KaKcv2oecvG2'));
  });
});
