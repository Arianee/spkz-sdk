import { JWTGeneric } from './JWTGeneric';
import { addDate } from '../timestampHelper/timestampHelper';
import { JSONRPCErrors } from '../../models/JSONRPCError';

const Web3 = require('web3');

describe('JWTGeneric', function () {
  const pubKey = '0x74FE09Db23Df5c35d2969B666f7AA94621E11D30';
  const privateKey = '0x14a99f4c1f00982e9f3762c9abaf88b30e9f3e6bb8b89bc99ecb76e1cd7a6538';

  const signer = (data) => new Web3().eth.accounts.sign(data, privateKey).signature;
  const decoder = (message, signature) => new Web3().eth.accounts.recover(message, signature);

  const payload = {
    userId: '1101001',
    name: 'John Doe'
  };
  const expectedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFVEgifQ==.eyJ1c2VySWQiOiIxMTAxMDAxIiwibmFtZSI6IkpvaG4gRG9lIn0=.0x9c81fd170109b7135a2bb45d85ee048fd4f0cbaf20da6cbbfd901e4145632f5a55df346edb3b6b7aa630dccd652f07deb4065eccd1f9aa8347ca970d96bfe9581c';

  describe('basic methods', () => {
    test('it should create a token', async () => {
      const jwt = new JWTGeneric(signer, decoder as any);

      const jwtService = await jwt.setPayload(payload);
      const token = await jwtService.sign();

      expect(token).toBe(expectedToken);
    });

    test('it should decode a token', () => {
      const jwt = new JWTGeneric(signer, decoder as any);

      const decodedToken = jwt
        .setToken(expectedToken)
        .decode();

      expect(decodedToken.payload).toEqual(payload);
    });

    test('it should verify a wrong pubKey and say false', () => {
      const jwt = new JWTGeneric(signer, decoder as any);

      const { isValid, details } = jwt
        .setToken(expectedToken)
        .verify('0x74FE09Db23Df5c35d2969B666f7AA94621E110');

      expect(isValid).toBeFalsy();
      expect(details).toBe(JSONRPCErrors.wrongSignatureForPayload);
    });

    test('it should verify the right pubkey and say true', () => {
      const jwt = new JWTGeneric(signer, decoder as any);

      const { isValid, details } = jwt
        .setToken(expectedToken)
        .verify(pubKey);

      expect(isValid).toBeTruthy();
      expect(details).toBeNull();
    });
  });

  describe('verify methods', () => {
    describe('exp', () => {
      test('it should be false if expired', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        const now = Date.now();
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() - 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          exp: exp.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeFalsy();
        expect(details).toBe(JSONRPCErrors.authorizationsJWTExpired);
      });
      test('it should be true if not expired', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() + 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          exp: exp.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });
    });
    describe('nbf', () => {
      test('it should be false if before nbf', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var nbf = new Date();
        nbf.setMinutes(nbf.getMinutes() + 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          nbf: nbf.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeFalsy();
        expect(details).toBe(JSONRPCErrors.authorizationsJWTNotBefore);
      });

      test('it should be true if after nbf', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var nbf = new Date();
        nbf.setMinutes(nbf.getMinutes() - 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          nbf: nbf.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });
    });
    describe('iat', () => {
      test('it should be false if before iat', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var iat = new Date();
        iat.setMinutes(iat.getMinutes() + 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          iat: iat.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeFalsy();
        expect(details).toBe(JSONRPCErrors.authorizationsJWTBeforeIat);
      });

      test('it should be true if after iat', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var iat = new Date();
        iat.setMinutes(iat.getMinutes() - 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          nbf: iat.getTime()
        };

        const jwtService = await jwt.setPayload(payload);
        const token = await jwtService.sign();

        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });
    });

    test('it should verify a token and say true', () => {
      const jwt = new JWTGeneric(signer, decoder as any);

      const { isValid, details } = jwt
        .setToken(expectedToken)
        .verify(pubKey);

      expect(isValid).toBeTruthy();
      expect(details).toBeNull();
    });

    describe('Signature with message', () => {
      test('test', async () => {
        const signerCustom = (data) => {
          // console.log(data);
          return signer(data);
        };

        const jwt = new JWTGeneric(signerCustom, decoder as any);

        const jwtSigner = jwt.setMessage('the message:').setPayload(payload);

        const signedJWT = await jwtSigner.sign();
        const { isValid, details } = jwt.setToken(signedJWT).verify(pubKey);
        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });

      test('A payload with message should be valid', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);

        const jwtSigner = jwt.setMessage('the message:').setPayload(payload);

        const signedJWT = await jwtSigner.sign();
        const { isValid, details } = jwt.setToken(signedJWT).verify(pubKey);
        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });

      test('it should be true if after iat with message', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var iat = new Date();
        iat.setMinutes(iat.getMinutes() - 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          nbf: iat.getTime()
        };

        const jwtService = await jwt.setPayload(payload).setMessage('the original new message : : :');
        const token = await jwtService.sign();
        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeTruthy();
        expect(details).toBeNull();
      });

      test('it should be false if before iat with message', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        var iat = new Date();
        iat.setMinutes(iat.getMinutes() + 5);
        const payload = {
          userId: '1101001',
          name: 'John Doe',
          iat: iat.getTime()
        };

        const jwtService = await jwt.setPayload(payload).setMessage('the original new message : : :');
        const token = await jwtService.sign();
        const { isValid, details } = jwt
          .setToken(token)
          .verify(pubKey);

        expect(isValid).toBeFalsy();
        expect(details).toBe(JSONRPCErrors.authorizationsJWTBeforeIat);
      });

      test('expected token should be good', async () => {
        const jwt = new JWTGeneric(signer, decoder as any);
        const payload = {
          userId: '1101001',
          name: 'John Doe'
        };

        const jwtService = await jwt.setPayload(payload).setMessage('the original new message : : :');
        const token = await jwtService.sign();

        expect(token).toBe('dGhlIG9yaWdpbmFsIG5ldyBtZXNzYWdlIDogOiA6CnsidHlwIjoiSldUIiwiYWxnIjoiRVRIIn0=.eyJ1c2VySWQiOiIxMTAxMDAxIiwibmFtZSI6IkpvaG4gRG9lIn0=.0x3866bab482e1a129b2facb854775188ac53584a185b744f62884916c8835f13f34054d8f881d158b2066670351282d17598e1686352137124bb11dfdecf3505c1c');
      });
    });
  });

  describe('decomposeToken', () => {
    test('decompose newer token', async () => {
      const token1 = ' the message:\n {"typ":"JWT","alg":"ETH"}.{"userId":"1101001","name":"John Doe"}.0x02060f9f541bf209da120ced3f6f3737ee4c41f840a493fe24ff317f46487a940e9707b7441e1f5cfe797ca9de330d7da8ba09f727f529e1fabb9121900640d81c';

      const jwt = new JWTGeneric(signer, decoder as any);
      const payload = {
        userId: '1101001',
        name: 'John Doe'
      };

      const jwToken = await jwt.setPayload(payload).setMessage('the original new message : : :').sign();

      const { isValid, details } = jwt
        .setToken(jwToken)
        .verify(pubKey);

      expect(isValid).toBeTruthy();
      expect(details).toBeNull();
    });
  });
});
