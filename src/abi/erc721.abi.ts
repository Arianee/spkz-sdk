export const erc721ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_interfaceID',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_hash',
        type: 'bytes32'
      },
      {
        name: '_tokenType',
        type: 'uint256'
      },
      {
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'isTokenValid',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '_name',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'getApproved',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_approved',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_target',
        type: 'address'
      },
      {
        name: '_abilities',
        type: 'uint256'
      }
    ],
    name: 'grantAbilities',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'validRecoveryRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'arianeeWhitelist',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_uri',
        type: 'string'
      }
    ],
    name: 'updateTokenURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_rewards',
        type: 'uint256'
      }
    ],
    name: 'reserveToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newURIBase',
        type: 'string'
      }
    ],
    name: 'setUriBase',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'addressToAbility',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenCreation',
    outputs: [
      {
        name: '_tokenCreation',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
    outputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'recoveryRequestOpen',
    outputs: [
      {
        name: '_recoveryRequest',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_storeAddress',
        type: 'address'
      }
    ],
    name: 'setStoreAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenImprint',
    outputs: [
      {
        name: '_imprint',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_operator',
        type: 'address'
      }
    ],
    name: 'canOperate',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '_symbol',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'store',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'destroy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_whitelistAddres',
        type: 'address'
      }
    ],
    name: 'setWhitelistAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_operator',
        type: 'address'
      },
      {
        name: '_approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'issuerOf',
    outputs: [
      {
        name: '_tokenIssuer',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_target',
        type: 'address'
      },
      {
        name: '_abilities',
        type: 'uint256'
      },
      {
        name: '_allowSuperRevoke',
        type: 'bool'
      }
    ],
    name: 'revokeAbilities',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'recoverTokenToIssuer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_key',
        type: 'address'
      },
      {
        name: '_enable',
        type: 'bool'
      },
      {
        name: '_tokenType',
        type: 'uint256'
      }
    ],
    name: 'addTokenAccess',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_target',
        type: 'address'
      },
      {
        name: '_abilities',
        type: 'uint256'
      }
    ],
    name: 'isAble',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'getRewards',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_tokenType',
        type: 'uint256'
      }
    ],
    name: 'tokenHashedAccess',
    outputs: [
      {
        name: '_tokenAccess',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenRecoveryDate',
    outputs: [
      {
        name: '_tokenRecoveryTimestamp',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_hash',
        type: 'bytes32'
      },
      {
        name: '_keepRequestToken',
        type: 'bool'
      },
      {
        name: '_newOwner',
        type: 'address'
      },
      {
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'requestToken',
    outputs: [
      {
        name: 'reward',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_imprint',
        type: 'bytes32'
      },
      {
        name: '_uri',
        type: 'string'
      },
      {
        name: '_initialKey',
        type: 'address'
      },
      {
        name: '_tokenRecoveryTimestamp',
        type: 'uint256'
      },
      {
        name: '_initialKeyIsRequestKey',
        type: 'bool'
      },
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'hydrateToken',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_active',
        type: 'bool'
      }
    ],
    name: 'updateRecoveryRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'isRequestable',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'uriBase',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_arianeeWhitelistAddress',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_addressType',
        type: 'string'
      },
      {
        indexed: false,
        name: '_newAddress',
        type: 'address'
      }
    ],
    name: 'SetAddress',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_imprint',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: '_uri',
        type: 'string'
      },
      {
        indexed: false,
        name: '_initialKey',
        type: 'address'
      },
      {
        indexed: false,
        name: '_tokenRecoveryTimestamp',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_initialKeyIsRequestKey',
        type: 'bool'
      },
      {
        indexed: false,
        name: '_tokenCreation',
        type: 'uint256'
      }
    ],
    name: 'Hydrated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_active',
        type: 'bool'
      }
    ],
    name: 'RecoveryRequestUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_token',
        type: 'uint256'
      }
    ],
    name: 'TokenRecovered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: 'URI',
        type: 'string'
      }
    ],
    name: 'TokenURIUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_encryptedTokenKey',
        type: 'address'
      },
      {
        indexed: false,
        name: '_enable',
        type: 'bool'
      },
      {
        indexed: false,
        name: '_tokenType',
        type: 'uint256'
      }
    ],
    name: 'TokenAccessAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'TokenDestroyed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_newUriBase',
        type: 'string'
      }
    ],
    name: 'SetNewUriBase',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Pause',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpause',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      },
      {
        indexed: true,
        name: '_abilities',
        type: 'uint256'
      }
    ],
    name: 'GrantAbilities',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_target',
        type: 'address'
      },
      {
        indexed: true,
        name: '_abilities',
        type: 'uint256'
      }
    ],
    name: 'RevokeAbilities',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_approved',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_operator',
        type: 'address'
      },
      {
        indexed: false,
        name: '_approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  }
];
