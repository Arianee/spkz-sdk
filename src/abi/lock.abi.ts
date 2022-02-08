// v9 https://etherscan.io/address/0x443618dc1094b2a7bfbe768861a1e31ced5b39dc#code https://docs.unlock-protocol.com/unlock/developers/smart-contracts
export const lockABI = [{
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'owner', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'approved', type: 'address'
  }, {
    indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'
  }],
  name: 'Approval',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'owner', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'operator', type: 'address'
  }, {
    indexed: false, internalType: 'bool', name: 'approved', type: 'bool'
  }],
  name: 'ApprovalForAll',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'
  }, {
    indexed: true, internalType: 'address', name: 'owner', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'sendTo', type: 'address'
  }, {
    indexed: false, internalType: 'uint256', name: 'refund', type: 'uint256'
  }],
  name: 'CancelKey',
  type: 'event'
}, {
  anonymous: false, inputs: [], name: 'Disable', type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'uint256', name: '_tokenId', type: 'uint256'
  }, {
    indexed: false, internalType: 'uint256', name: '_amount', type: 'uint256'
  }, {
    indexed: false, internalType: 'bool', name: '_timeAdded', type: 'bool'
  }],
  name: 'ExpirationChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'
  }],
  name: 'ExpireKey',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'receiver', type: 'address'
  }, {
    indexed: false, internalType: 'uint256', name: 'refundedAmount', type: 'uint256'
  }, {
    indexed: false, internalType: 'address', name: 'tokenAddress', type: 'address'
  }],
  name: 'GasRefunded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }],
  name: 'KeyGranterAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }],
  name: 'KeyGranterRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'uint256', name: '_tokenId', type: 'uint256'
  }, {
    indexed: true, internalType: 'address', name: '_newManager', type: 'address'
  }],
  name: 'KeyManagerChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }],
  name: 'LockManagerAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }],
  name: 'LockManagerRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'string', name: 'symbol', type: 'string'
  }],
  name: 'NewLockSymbol',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'uint256', name: 'oldKeyPrice', type: 'uint256'
  }, {
    indexed: false, internalType: 'uint256', name: 'keyPrice', type: 'uint256'
  }, {
    indexed: false, internalType: 'address', name: 'oldTokenAddress', type: 'address'
  }, {
    indexed: false, internalType: 'address', name: 'tokenAddress', type: 'address'
  }],
  name: 'PricingChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'uint256', name: 'freeTrialLength', type: 'uint256'
  }, {
    indexed: false, internalType: 'uint256', name: 'refundPenaltyBasisPoints', type: 'uint256'
  }],
  name: 'RefundPenaltyChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'owner', type: 'address'
  }, {
    indexed: false, internalType: 'uint256', name: 'newExpiration', type: 'uint256'
  }],
  name: 'RenewKeyPurchase',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32'
  }, {
    indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32'
  }, {
    indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32'
  }],
  name: 'RoleAdminChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32'
  }, {
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'sender', type: 'address'
  }],
  name: 'RoleGranted',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32'
  }, {
    indexed: true, internalType: 'address', name: 'account', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'sender', type: 'address'
  }],
  name: 'RoleRevoked',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'from', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'to', type: 'address'
  }, {
    indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256'
  }],
  name: 'Transfer',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'uint256', name: 'transferFeeBasisPoints', type: 'uint256'
  }],
  name: 'TransferFeeChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'lockAddress', type: 'address'
  }, {
    indexed: false, internalType: 'address', name: 'unlockAddress', type: 'address'
  }],
  name: 'UnlockCallFailed',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true, internalType: 'address', name: 'sender', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'tokenAddress', type: 'address'
  }, {
    indexed: true, internalType: 'address', name: 'beneficiary', type: 'address'
  }, {
    indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256'
  }],
  name: 'Withdrawal',
  type: 'event'
}, {
  inputs: [], name: 'DEFAULT_ADMIN_ROLE', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'KEY_GRANTER_ROLE', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'LOCK_MANAGER_ROLE', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'addKeyGranter', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'addLockManager', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_approved', type: 'address' }, { internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'approve', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_spender', type: 'address' }, { internalType: 'uint256', name: '_amount', type: 'uint256' }], name: 'approveBeneficiary', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'beneficiary', outputs: [{ internalType: 'address payable', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'cancelAndRefund', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'disableLock', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'expirationDuration', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address payable', name: '_keyOwner', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'expireAndRefundFor', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'freeTrialLength', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'gasRefundValue', outputs: [{ internalType: 'uint256', name: '_refundValue', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'getApproved', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }], name: 'getCancelAndRefundValueFor', outputs: [{ internalType: 'uint256', name: 'refund', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }], name: 'getHasValidKey', outputs: [{ internalType: 'bool', name: 'isValid', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }], name: 'getRoleAdmin', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_account', type: 'address' }], name: 'getTokenIdFor', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }, { internalType: 'uint256', name: '_time', type: 'uint256' }], name: 'getTransferFee', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address[]', name: '_recipients', type: 'address[]' }, { internalType: 'uint256[]', name: '_expirationTimestamps', type: 'uint256[]' }, { internalType: 'address[]', name: '_keyManagers', type: 'address[]' }], name: 'grantKeys', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }, { internalType: 'address', name: 'account', type: 'address' }], name: 'grantRole', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }, { internalType: 'address', name: 'account', type: 'address' }], name: 'hasRole', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address payable', name: '_lockCreator', type: 'address' }, { internalType: 'uint256', name: '_expirationDuration', type: 'uint256' }, { internalType: 'address', name: '_tokenAddress', type: 'address' }, { internalType: 'uint256', name: '_keyPrice', type: 'uint256' }, { internalType: 'uint256', name: '_maxNumberOfKeys', type: 'uint256' }, { internalType: 'string', name: '_lockName', type: 'string' }], name: 'initialize', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'isAlive', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_owner', type: 'address' }, { internalType: 'address', name: '_operator', type: 'address' }], name: 'isApprovedForAll', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'isKeyGranter', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'isLockManager', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }], name: 'keyExpirationTimestampFor', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'keyManagerOf', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'keyPrice', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'maxNumberOfKeys', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'numberOfOwners', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'onKeyCancelHook', outputs: [{ internalType: 'contract ILockKeyCancelHook', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'onKeyPurchaseHook', outputs: [{ internalType: 'contract ILockKeyPurchaseHook', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'onTokenURIHook', outputs: [{ internalType: 'contract ILockTokenURIHook', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'onValidKeyHook', outputs: [{ internalType: 'contract ILockValidKeyHook', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'publicLockVersion', outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }], stateMutability: 'pure', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_value', type: 'uint256' }, { internalType: 'address', name: '_recipient', type: 'address' }, { internalType: 'address', name: '_referrer', type: 'address' }, { internalType: 'address', name: '_keyManager', type: 'address' }, { internalType: 'bytes', name: '_data', type: 'bytes' }], name: 'purchase', outputs: [], stateMutability: 'payable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_recipient', type: 'address' }, { internalType: 'address', name: '_referrer', type: 'address' }, { internalType: 'bytes', name: '_data', type: 'bytes' }], name: 'purchasePriceFor', outputs: [{ internalType: 'uint256', name: 'minKeyPrice', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'refundPenaltyBasisPoints', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'renounceLockManager', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }, { internalType: 'address', name: 'account', type: 'address' }], name: 'renounceRole', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_granter', type: 'address' }], name: 'revokeKeyGranter', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }, { internalType: 'address', name: 'account', type: 'address' }], name: 'revokeRole', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_from', type: 'address' }, { internalType: 'address', name: '_to', type: 'address' }, { internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'safeTransferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_from', type: 'address' }, { internalType: 'address', name: '_to', type: 'address' }, { internalType: 'uint256', name: '_tokenId', type: 'uint256' }, { internalType: 'bytes', name: '_data', type: 'bytes' }], name: 'safeTransferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_to', type: 'address' }, { internalType: 'bool', name: '_approved', type: 'bool' }], name: 'setApprovalForAll', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'string', name: '_baseTokenURI', type: 'string' }], name: 'setBaseTokenURI', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_onKeyPurchaseHook', type: 'address' }, { internalType: 'address', name: '_onKeyCancelHook', type: 'address' }, { internalType: 'address', name: '_onValidKeyHook', type: 'address' }, { internalType: 'address', name: '_onTokenURIHook', type: 'address' }], name: 'setEventHooks', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_newExpirationDuration', type: 'uint256' }], name: 'setExpirationDuration', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_refundValue', type: 'uint256' }], name: 'setGasRefundValue', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }, { internalType: 'address', name: '_keyManager', type: 'address' }], name: 'setKeyManagerOf', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_maxNumberOfKeys', type: 'uint256' }], name: 'setMaxNumberOfKeys', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_to', type: 'address' }, { internalType: 'uint256', name: '_tokenId', type: 'uint256' }, { internalType: 'uint256', name: '_timeShared', type: 'uint256' }], name: 'shareKey', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }], name: 'supportsInterface', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'tokenAddress', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_index', type: 'uint256' }], name: 'tokenByIndex', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_keyOwner', type: 'address' }, { internalType: 'uint256', name: '_index', type: 'uint256' }], name: 'tokenOfOwnerByIndex', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'tokenURI', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_to', type: 'address' }, { internalType: 'uint256', name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'transferFeeBasisPoints', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_from', type: 'address' }, { internalType: 'address', name: '_recipient', type: 'address' }, { internalType: 'uint256', name: '_tokenId', type: 'uint256' }], name: 'transferFrom', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [], name: 'unlockProtocol', outputs: [{ internalType: 'contract IUnlock', name: '', type: 'address' }], stateMutability: 'view', type: 'function'
}, {
  inputs: [{ internalType: 'address payable', name: '_beneficiary', type: 'address' }], name: 'updateBeneficiary', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_keyPrice', type: 'uint256' }, { internalType: 'address', name: '_tokenAddress', type: 'address' }], name: 'updateKeyPricing', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'string', name: '_lockName', type: 'string' }], name: 'updateLockName', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'string', name: '_lockSymbol', type: 'string' }], name: 'updateLockSymbol', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_freeTrialLength', type: 'uint256' }, { internalType: 'uint256', name: '_refundPenaltyBasisPoints', type: 'uint256' }], name: 'updateRefundPenalty', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'uint256', name: '_transferFeeBasisPoints', type: 'uint256' }], name: 'updateTransferFee', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, {
  inputs: [{ internalType: 'address', name: '_tokenAddress', type: 'address' }, { internalType: 'uint256', name: '_amount', type: 'uint256' }], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function'
}, { stateMutability: 'payable', type: 'receive' }];
