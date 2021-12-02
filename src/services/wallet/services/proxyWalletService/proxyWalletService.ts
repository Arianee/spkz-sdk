import { addDate } from '../../../../helpers/timestampHelper/timestampHelper';
import { signerDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';
import { JWTGeneric } from '../../../../helpers/JWTGeneric/JWTGeneric';
import { Lifecycle, scoped } from 'tsyringe';
import Web3 from 'web3';
import { Account } from 'web3-core';
import { required } from '../../../../helpers/required/required';
import { RightService } from '../../../utils/services/rightService/rightService';
import { AuthorizationsStatus } from '../../../../models/authorizationsStatus';
import { MetamaskService } from '../metamask/metamaskService';

const localStorageAuthorizationKey = 'spkz_authorizations';

@scoped(Lifecycle.ContainerScoped)
export class ProxyWalletService {
  constructor (
    private rightService: RightService,
    private metamaskService: MetamaskService
  ) {
  }

  get authorizedAddresses () {
    return [...this._authorizedAddresses];
  }

  get authorizations (): any[] {
    return [...this._authorizations];
  }

  set authorizations (value: any[]) {
    this._authorizations = value;
  }

  private _authorizedAddresses: string[] = [];

  private _authorizations = [];
  private web3Account: Account;
  public signer: (data) => any;
  public decoder: (message, signature) => any;
  public jwtHelper: JWTGeneric;
  private _privateKey: string;

  get privateKey (): string {
    return this._privateKey;
  }

  get address (): string {
    return this.web3Account.address;
  }

  set privateKey (value: string) {
    this._privateKey = value;
    this.web3Account = new Web3().eth.accounts.privateKeyToAccount(this._privateKey);
    const {
      signer,
      decoder
    } = signerDecoder(this._privateKey);
    this.signer = signer;
    this.decoder = decoder;
    this.jwtHelper = new JWTGeneric(this.signer, this.decoder);
    this.retrieveJWTAuthorizationsFromLocalStorage()
      .map(jwt => this.addBlockchainWalletAuthorization(jwt));
  }

  /**
   * Get blockchainWallets authorizations from localstorage
   * If proxyWallet not authorized, it removes entry from localstorage and return empty array
   * @returns {[]}
   */
  private retrieveJWTAuthorizationsFromLocalStorage = (): any[] => {
    if (typeof localStorage !== 'undefined') {
      const valueFromStorage = localStorage.getItem(localStorageAuthorizationKey);
      if (valueFromStorage) {
        try {
          const parseValue: any[] = JSON.parse(valueFromStorage);
          const isAuthorized = RightService.isProxyWalletAuthorized(parseValue, this.address);
          if (isAuthorized) {
            return parseValue;
          }
        } catch (e) {

        }
      }

      localStorage.removeItem(localStorageAuthorizationKey);
    }

    return [];
  };

  public async addFromMetamask () {
    await this.metamaskService.initMetamask();
    const payloadToSign = this.getPayloadToSignToAddABlockchainWallet(this.metamaskService.defaultAccount);

    const jwtSigner = new JWTGeneric(this.metamaskService.signData, () => {
    });
    const zef = jwtSigner.setPayload(payloadToSign)
      .setMessage('You need to sign an authorization for a burner wallet. This authorization allows you to send messages without having to sign each message. It\'s an offchain signature, it\'s gas free !');
    const signedJWT = await zef.sign();

    this.addBlockchainWalletAuthorization(signedJWT);
    return this;
  }

  public addFromMetamaskWc = async ():Promise<{url:string, signature:Promise<any>}> => {
    const url = await this.metamaskService.initMMWC();
    let signature;
    const sign = async () => {
      const jwtSigner = new JWTGeneric(this.metamaskService.signWithWc, () => {
      });
      const payloadToSign = this.getPayloadToSignToAddABlockchainWallet(this.metamaskService.defaultAccount);

      const jwt = jwtSigner.setPayload(payloadToSign);
      const signedJWT = await jwt.sign();
      return this.addBlockchainWalletAuthorization(signedJWT);
    };

    if (!this.metamaskService.connector.connected) {
      this.metamaskService.connector.on('connect', async (error, payload) => {
        this.metamaskService.defaultAccount = payload.params[0].accounts[0];
        signature = sign();
      });
    } else {
      signature = sign();
    }
    return { url, signature };
  }

  public async addWalletFromPrivateKey (privateKey: string) {
    const {
      signer,
      decoder,
      address
    } = signerDecoder(privateKey);
    const jwtSigner = new JWTGeneric(signer, decoder);
    const payloadToSign = this.getPayloadToSignToAddABlockchainWallet(address);
    const zef = await jwtSigner.setPayload(payloadToSign);

    const signedJWT = await zef.sign();

    this.addBlockchainWalletAuthorization(signedJWT);
    return this;
  }

  public addFromCustomWallet () {

  }

  /**
   * Check if authorizations from blockchainWallets are still valid (not expired, sub is proxyWallet...)
   * It should be call on every app launch
   * @returns {Promise<AuthorizationsStatus>}
   */
  public checkBlockchainWalletAuthorizations = async (): Promise<AuthorizationsStatus> => {
    return this.rightService.proxyWalletAuthorisationStatus(this.authorizations, this.address);
  };

  async addBlockchainWalletAuthorization (jwt): Promise<ProxyWalletService> {
    const issuer = this.jwtHelper.setToken(jwt).decode().payload.iss;
    required(this.jwtHelper.setToken(jwt).verify(issuer), 'iss of jwt should be the issuer');

    if (!this._authorizedAddresses.includes(issuer)) {
      this._authorizedAddresses.push(issuer);
      this._authorizations.push(jwt);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(localStorageAuthorizationKey, JSON.stringify(this.authorizations));
      }
    }

    return this;
  }

  /**
   * Get payload to authorized messaging wallet to send message on behalf of another blockchain wallet
   * @param {string} publicKey
   * @returns {{sub: any; iss: string; exp: number}}
   */
  public getPayloadToSignToAddABlockchainWallet (publicKey: string) {
    return {
      iss: publicKey.toLowerCase(),
      exp: addDate(7, 'days'),
      sub: this.address.toLowerCase(),
      iat: Date.now()
    };
  }

  public createAuthLink = (url: string): string => {
    const urlObject = new URL(url);
    urlObject.searchParams.append('spkz_authorizations', JSON.stringify(this.authorizations));
    urlObject.searchParams.append('spkz_proxyWalletPK', this.privateKey);

    return urlObject.href;
  };
}
