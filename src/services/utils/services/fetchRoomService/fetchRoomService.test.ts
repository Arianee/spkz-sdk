import { container } from 'tsyringe';
import { FetchRoomService } from './fetchRoomService';
import { HttpService } from '../httpService/httpService';
import { Contract } from 'ethers';
import { ContractService } from '../contractService/contractService';

describe('fetchRoom', () => {
  let fetchRoomService: FetchRoomService;
  beforeEach(() => {
    jest.resetAllMocks();
    container.clearInstances();
    container.reset();
    fetchRoomService = container.resolve(FetchRoomService);
  });

  // soft cache= without hard cache. Caching Promise
  test('fetch room with soft cache', async () => {
    fetchRoomService.rawFetchRoom = jest.fn().mockImplementation(fetchRoomService.rawFetchRoom);

    await Promise.all([
      fetchRoomService.fetchRoom('2'),
      fetchRoomService.fetchRoom('2'),
      fetchRoomService.fetchRoom('2')
    ]);
    expect(fetchRoomService.rawFetchRoom).toHaveBeenCalledTimes(1);
  });

  test('fetch room with hard cache', async () => {
    const cacheDatabse = {};
    const cacheObject = {
      get: jest.fn((roomId) => {
        return Promise.resolve(cacheDatabse[roomId]);
      }),
      set: jest.fn().mockImplementation((parameters: { roomId, content }) => {
        cacheDatabse[parameters.roomId] = parameters.content;
        return Promise.resolve(cacheDatabse[parameters.roomId]);
      })
    };
    fetchRoomService.rawFetchRoom = jest.fn().mockImplementation(fetchRoomService.rawFetchRoom);

    fetchRoomService.setCacheMethods(cacheObject);
    await fetchRoomService.fetchRoom('1');
    expect(cacheObject.get).toHaveBeenCalledWith('1');
    expect(cacheObject.set).toHaveBeenCalledTimes(1);

    await fetchRoomService.fetchRoom('1');
    expect(cacheObject.get).toHaveBeenCalledTimes(2);
    expect(cacheObject.set).toHaveBeenCalledTimes(1);
    expect(fetchRoomService.rawFetchRoom).toHaveBeenCalledTimes(1);
  });

  test('fetch multiple rooms and add cache', async () => {
    const cacheDatabse = {};
    const cacheObject = {
      get: jest.fn((roomId) => {
        return Promise.resolve(cacheDatabse[roomId]);
      }),
      set: jest.fn().mockImplementation((parameters: { roomId, content }) => {
        cacheDatabse[parameters.roomId] = parameters.content;
        return Promise.resolve(cacheDatabse[parameters.roomId]);
      })
    };
    fetchRoomService.rawFetchRoom = jest.fn().mockImplementation(fetchRoomService.rawFetchRoom);

    const fakeContent:any = { endpoint: 'a fake content' };
    fetchRoomService.setCacheMethods(cacheObject);
    fetchRoomService.addToCache('0', fakeContent);

    const content = await fetchRoomService.fetchRoom('0');
    expect(content).toEqual(fakeContent);
    expect(fetchRoomService.rawFetchRoom).toHaveBeenCalledTimes(0);
  });

  test('fetch multiple rooms with hard cache', async () => {
    const cacheDatabse = {};
    const cacheObject = {
      get: jest.fn((roomId) => {
        return Promise.resolve(cacheDatabse[roomId]);
      }),
      set: jest.fn().mockImplementation((parameters: { roomId, content }) => {
        cacheDatabse[parameters.roomId] = parameters.content;
        return Promise.resolve(cacheDatabse[parameters.roomId]);
      })
    };
    fetchRoomService.rawFetchRoom = jest.fn().mockImplementation(fetchRoomService.rawFetchRoom);

    fetchRoomService.setCacheMethods(cacheObject);
    await Promise.all([
      fetchRoomService.fetchRoom('0'),
      fetchRoomService.fetchRoom('1'),
      fetchRoomService.fetchRoom('2'),
      fetchRoomService.fetchRoom('1')
    ]);

    expect(fetchRoomService.rawFetchRoom).toHaveBeenCalledTimes(3);
  });

  test('fetchroom should return undefined if room doesn\'t exist', async () => {
    fetchRoomService.rawFetchRoom = () => { return Promise.resolve(undefined); };
    const roomUndefined = await fetchRoomService.fetchRoom('1');
    expect(roomUndefined).toBeUndefined();
  });
});
