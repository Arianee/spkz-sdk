import { Base64 } from 'js-base64';
import { ErrorPayload } from '../../models/jsonrpc/errorPayload';
import { JWTGenericErrors } from '../../models/JWTGenericErrors';

export class JWTGeneric {
  private header = {
    typ: 'JWT',
    alg: 'ETH'
  };

  private payload;
  private encodedToken: string;
  private message: string;

  constructor (private signer: (data) => {}, private decoder: any) {

  }

  /**
   * Set payload to be signed
   * @param payload
   */
  public setMessage = (payload) => {
    this.message = payload + '\n';

    return {
      sign: this.sign.bind(this),
      setHeader: this.setHeader.bind(this),
      setPayload: this.setPayload.bind(this)
    };
  };

  /**
   * Set payload to be signed
   * @param payload
   */
  public setPayload = (payload) => {
    this.payload = payload;

    return {
      sign: this.sign.bind(this),
      setHeader: this.setHeader.bind(this),
      setMessage: this.setMessage.bind(this)
    };
  };

  /**
   * Set payload to be signed
   * @param payload
   */
  private setHeader = async (payload) => {
    this.header = payload;
    return {
      sign: await this.sign.bind(this),
      setPayload: this.setPayload.bind(this),
      setMessage: this.setMessage.bind(this)
    };
  };

  /**
   * Set token to be verified or decoded
   * @param encodedToken
   */
  public setToken (encodedToken) {
    this.encodedToken = encodedToken;
    return {
      decode: this.decode.bind(this),
      verify: this.verify.bind(this)
    };
  }

  private static encodeBase64 (data: string): string {
    return Base64.encode(data);
  }

  private static fromBase64JSONParse (data: string) {
    return JSON.parse(Base64.fromBase64(data));
  }

  private async sign () {
    const stringifyHeader = JSON.stringify(this.header);
    const stringifyPayload = JSON.stringify(this.payload);
    let contentToSign;
    let contentToSignBASE64;
    if (this.message) {
      contentToSign = `${this.message}${stringifyHeader}.${stringifyPayload}`;
      contentToSignBASE64 = `${JWTGeneric.encodeBase64(this.message + stringifyHeader)}.${JWTGeneric.encodeBase64(stringifyPayload)}`;
    } else {
      contentToSign = `${stringifyHeader}.${stringifyPayload}`;
      contentToSignBASE64 = `${JWTGeneric.encodeBase64(stringifyHeader)}.${JWTGeneric.encodeBase64(stringifyPayload)}`;
    }

    const signature = await this.signature(contentToSign);

    const res = `${contentToSignBASE64}.${signature}`;
    return res;
  }

  /**
   * Verify if signature was signed by pubKey and return true/false
   * @param pubKey
   */
  private verify (pubKey: string): { isValid: boolean, details: ErrorPayload } {
    const {
      signature,
      payload,
      headerAndMessage,
      userMessage,
      header,
      signedData,
      signedDataBase64
    } = this.decode();
    const decode = this.decoder(signedData, signature);
    const decodeBase64 = this.decoder(signedDataBase64, signature); // used for legacy sign

    const { isValid, details } = this.arePropertiesValid(payload);

    if (!isValid) {
      return {
        isValid: false,
        details
      };
    }

    const isPubKeyValid = (pubKey.toLowerCase() === decode.toLowerCase() || pubKey.toLowerCase() === decodeBase64.toLowerCase());

    return {
      isValid: isPubKeyValid,
      details: isPubKeyValid ? details : JWTGenericErrors.publicKeyAndDecodedKeyMismatch
    };
  }

  private arePropertiesValid = (payload): { isValid: boolean, details: ErrorPayload } => {
    if (payload.exp) {
      const isExpired = new Date(payload.exp).getTime() < Date.now();
      if (isExpired) {
        return {
          isValid: false,
          details: JWTGenericErrors.authorizationsJWTExpired
        };
      }
    }
    if (payload.nbf) {
      const isBefore = new Date(payload.nbf).getTime() > Date.now();
      if (isBefore) {
        return {
          isValid: false,
          details: JWTGenericErrors.authorizationsJWTNotBefore
        };
      }
    }
    if (payload.iat) {
      const isBefore = new Date(payload.iat).getTime() > Date.now();
      if (isBefore) {
        return {
          isValid: false,
          details: JWTGenericErrors.authorizationsJWTBeforeIat
        };
      }
    }
    return {
      isValid: true,
      details: null
    };
  };

  private decode () {
    let [headerAndMessage, payload, signature] = this.encodedToken.split('.');
    const signedDataBase64 = `${headerAndMessage}.${payload}`; // used for legacy sign
    headerAndMessage = Base64.fromBase64(headerAndMessage);
    payload = Base64.fromBase64(payload);
    const signedData = `${headerAndMessage}.${payload}`;
    payload = JSON.parse(payload);
    const [userMessage, header] = headerAndMessage.split('\n');

    return {
      headerAndMessage,
      payload,
      signature,
      userMessage,
      header,
      signedData,
      signedDataBase64
    };
  }

  private signature (payload) {
    return this.signer(payload);
  }
}
