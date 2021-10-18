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
    message: 'The signature of the payload or the signature of blockchain wallets do not correpond'
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
  }
};
