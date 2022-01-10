import { ErrorPayload } from './jsonrpc/errorPayload';

export const JSONRPCErrors = {
  unknownError: {
    code: -1,
    details: {},
    message: 'This error is not handled please see details'
  },
  wrongSignatureForPayload: {
    code: 1,
    details: {},
    message: 'The signature of the payload or the signature of blockchain wallets do not correspond'
  },
  notHasReadRight: {
    code: 2,
    details: {},
    message: 'Blockchain wallet does not pass strategy to read'
  },
  notHasWriteRight: {
    code: 3,
    details: {},
    message: 'Blockchain wallet does not pass strategy to write'
  },
  notHasJoinRoomRight: {
    code: 4,
    details: {},
    message: 'Blockchain wallet does not pass strategy to join room'
  },
  authorizationsJWTExpired: {
    code: 5,
    details: {},
    message: 'The authorizations JWT is expired'
  },
  authorizationsJWTNotBefore: {
    code: 6,
    details: {},
    message: 'The authorizations JWT nbf is greater than the current date'
  },
  authorizationsJWTBeforeIat: {
    code: 7,
    details: {},
    message: 'The authorizations JWT iat is greater than the current date'
  }
};
