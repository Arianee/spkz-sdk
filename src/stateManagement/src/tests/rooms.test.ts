import { getStore } from '../store';
import { cloneDeep } from 'lodash';
import {
  $subscribeFeaturedRooms,
  $subscribeRecommendedRooms,
  $subscribeToRoom,
  getRoom
} from '../selectors/room.selector';
import { addOrUpdateRooms } from '../reducers/rooms/actions';

describe('Store', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('Add room', () => {
    const room1 = () => cloneDeep({
      endpoint: 'https://node0.spkz.io/spkz/rpc',
      notificationEndpoint: 'wss://node0-ws.spkz.io',
      name: 'SPKZ Bar1',
      description: 'Welcome to SPKZ, a community suited for a web3 world. This collection depicts the officially represented projects that are speaking easy within SPKZ.io. But our doors are open to all. Mint a lounge and your unique NFT will be found here as well.',
      external_url: 'https://spkz.io/app/lounges/10',
      image: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/spkz-logo.jpeg',
      logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/spkz-logo.jpeg',
      strategies: [
        []
      ],
      sections: [
        {
          title: 'Bar',
          id: 'thebar',
          writeStrategies: [
            [
              {
                name: 'room-owner',
                params: {
                  chainId: '137',
                  networkId: '1'
                }
              }
            ]
          ]
        },
        {
          title: 'Private Lounge',
          id: 'privatelounge',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'GM',
          id: 'gm',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'Features/Bugs',
          id: 'featuresbugs',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        }
      ]
    });
    const room2 = () => cloneDeep({
      endpoint: 'https://node0.spkz.io/spkz/rpc',
      notificationEndpoint: 'wss://node0-ws.spkz.io',
      name: 'SPKZ Bar2',
      description: 'Welcome to SPKZ, a community suited for a web3 world. This collection depicts the officially represented projects that are speaking easy within SPKZ.io. But our doors are open to all. Mint a lounge and your unique NFT will be found here as well.',
      external_url: 'https://spkz.io/app/lounges/10',
      image: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/spkz-logo.jpeg',
      logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/spkz-logo.jpeg',
      strategies: [
        []
      ],
      sections: [
        {
          title: 'Bar',
          id: 'thebar',
          writeStrategies: [
            [
              {
                name: 'room-owner',
                params: {
                  chainId: '137',
                  networkId: '1'
                }
              }
            ]
          ]
        },
        {
          title: 'Private Lounge',
          id: 'privatelounge',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'GM',
          id: 'gm',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        },
        {
          title: 'Features/Bugs',
          id: 'featuresbugs',
          readStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ],
          writeStrategies: [
            [
              {
                name: 'erc-721-balance-of',
                logo: 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/SPKZ_Lounge_NFT.png',
                params: {
                  minBalance: '1',
                  tokens: [
                    {
                      chainId: '137',
                      networkId: '1',
                      address: '0xaA9475F83F6FDb1416270447364f9bd70e41fB21'
                    }
                  ]
                }
              }
            ]
          ]
        }
      ]
    });

    describe('create room details', () => {
      test('it should create room in redux', () => {
        expect(getRoom({ roomId: '22' })).toBeUndefined();

        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);

        const { roomId, roomDetails } = getRoom({ roomId: '22' });
        expect(roomId).toBe('22');
        expect(roomDetails).toEqual(room1());
      });
      test('it should update room in redux', () => {
        expect(getRoom({ roomId: '22' })).toBeUndefined();

        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);
        expect(getRoom({ roomId: '22' }).roomDetails).toEqual(room1());

        addOrUpdateRooms([{ roomId: '22', roomDetails: room2() }]);
        expect(getRoom({ roomId: '22' }).roomDetails).toEqual(room2());
      });
    });
    describe('featured, recommended, verified', () => {
      test('it should be false by default room in redux', () => {
        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);

        expect(getRoom({ roomId: '22' }).verified).toBe(false);
        expect(getRoom({ roomId: '22' }).special).toBe(false);
        expect(getRoom({ roomId: '22' }).recommended).toBe(false);
        expect(getRoom({ roomId: '22' }).featured).toBe(false);

        addOrUpdateRooms([{ roomId: '22', verified: true, special: true }]);
        expect(getRoom({ roomId: '22' }).verified).toBe(true);
        expect(getRoom({ roomId: '22' }).special).toBe(true);
        expect(getRoom({ roomId: '22' }).recommended).toBe(false);
        expect(getRoom({ roomId: '22' }).featured).toBe(false);

        addOrUpdateRooms([{ roomId: '22', featured: true, recommended: true }]);
        expect(getRoom({ roomId: '22' }).verified).toBe(true);
        expect(getRoom({ roomId: '22' }).special).toBe(true);
        expect(getRoom({ roomId: '22' }).recommended).toBe(true);
        expect(getRoom({ roomId: '22' }).featured).toBe(true);
      });
    });

    describe('observable', () => {
      test('it should observable featured of rooms', (done) => {
        addOrUpdateRooms([{ roomId: '22', roomDetails: room2(), featured: true }]);
        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);
        let i = 0;
        $subscribeFeaturedRooms()
          .subscribe(d => {
            if (i === 0) {
              d.forEach(e => expect(e.featured === true));
              expect(d.length === 1);
            } else if (i === 1) {
              d.forEach(e => expect(e.featured === true));
              expect(d.length === 2);

              done();
            }
            i++;
          });
        addOrUpdateRooms([{ roomId: '22', verified: true, special: true }]);
        addOrUpdateRooms([{ roomId: '33', roomDetails: room2(), featured: true }]);
      });
      test('it should observable recommened of rooms', (done) => {
        addOrUpdateRooms([{ roomId: '22', roomDetails: room2(), featured: true }]);
        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);
        let i = 0;
        $subscribeRecommendedRooms()
          .subscribe(d => {
            if (i === 0) {
              d.forEach(e => expect(e.recommended === true));
              expect(d.length === 1);
            } else if (i === 1) {
              d.forEach(e => expect(e.recommended === true));
              expect(d.length === 2);

              done();
            }
            i++;
          });
        addOrUpdateRooms([{ roomId: '22', verified: true, special: true }]);
        addOrUpdateRooms([{ roomId: '33', roomDetails: room2(), recommended: true }]);
      });

      test('it should observable difference of rooms', (done) => {
        addOrUpdateRooms([{ roomId: '22', roomDetails: room2() }]);
        addOrUpdateRooms([{ roomId: '22', roomDetails: room1() }]);

        let i = 0;
        $subscribeToRoom({ roomId: '22' })
          .subscribe(d => {
            if (i === 0) {
              expect(getRoom({ roomId: '22' }).verified).toBe(false);
              expect(d.roomDetails).toEqual(room1());
            } else if (i === 1) {
              expect(getRoom({ roomId: '22' }).verified).toBe(true);
              done();
            }
            i++;
          });
        addOrUpdateRooms([{ roomId: '22', verified: true, special: true }]);
      });
    });
  });
});
