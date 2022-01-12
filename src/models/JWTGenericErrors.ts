export const JWTGenericErrors = {
  unknownError: {
    code: -1,
    details: {},
    message: 'This error is not handled please see details'
  },
  publicKeyAndDecodedKeyMismatch: {
    code: 1,
    details: {},
    message: 'The public key does not correspond to the decoded key'
  },
  authorizationsJWTExpired: {
    code: 2,
    details: {},
    message: 'The authorizations JWT is expired'
  },
  authorizationsJWTNotBefore: {
    code: 3,
    details: {},
    message: 'The authorizations JWT nbf is greater than the current date'
  },
  authorizationsJWTBeforeIat: {
    code: 4,
    details: {},
    message: 'The authorizations JWT iat is greater than the current date'
  }
};
