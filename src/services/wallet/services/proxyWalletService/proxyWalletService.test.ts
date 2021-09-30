import { clearWallet, createOrRetrieveWallet } from '../../../walletBrowserCreator/walletCreator';
import { JWTGeneric } from '../../../../helpers/JWTGeneric/JWTGeneric';
import { signerDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';
import { SPKZ } from '../../index';

describe('proxy wallet', () => {
  let proxyWallet:SPKZ;

  beforeEach(() => {
    localStorage.clear();
    proxyWallet = createOrRetrieveWallet();
    proxyWallet.environmentService.swithEnv('dev');
  });

  test('should be able to add blockchainWallets', async () => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
    const pkBlockchainWallet2 = 'eb21efb9ddeb98d4d65869cb4abc2fcbe0bcd33ca8086b2d2ef70261ecb726f2';

    expect(proxyWallet.wallets.authorizations).toHaveLength(0);
    expect(proxyWallet.wallets.authorizations).toHaveLength(0);

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);

    expect(proxyWallet.wallets.authorizations).toHaveLength(1);
    expect(proxyWallet.wallets.authorizations).toHaveLength(1);

    const { signer, decoder, address } = signerDecoder('0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161');
    const genericJWT = new JWTGeneric(signer, decoder);

    const verify = genericJWT.setToken(proxyWallet.wallets.authorizations[0]).verify(address);
    expect(verify).toBeTruthy();

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
    expect(proxyWallet.wallets.authorizedAddresses).toHaveLength(1);
    expect(proxyWallet.wallets.authorizations).toHaveLength(1);

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet2);
    expect(proxyWallet.wallets.authorizedAddresses).toHaveLength(2);
    expect(proxyWallet.wallets.authorizations).toHaveLength(2);
  });

  test('should be able to retrieve blockchainWallets authorizations from localstorage', async () => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
    expect(proxyWallet.wallets.authorizedAddresses).toHaveLength(1);
    expect(proxyWallet.wallets.authorizations).toHaveLength(1);

    const proxyWallet2 = createOrRetrieveWallet();
    expect(proxyWallet2.wallets.authorizedAddresses).toHaveLength(1);
    expect(proxyWallet2.wallets.authorizations).toHaveLength(1);
  });

  test('should not return blockchainWallets authorizations of another proxyWallet', async () => {
    const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

    await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
    expect(proxyWallet.wallets.authorizedAddresses).toHaveLength(1);
    expect(proxyWallet.wallets.authorizations).toHaveLength(1);

    const proxyWallet2 = clearWallet();
    expect(proxyWallet2.wallets.authorizedAddresses).toHaveLength(0);
    expect(proxyWallet2.wallets.authorizations).toHaveLength(0);
  });

  describe('checkBlockchainWalletAuthorizations', () => {
    test('should return isAuthorized true', async () => {
      const pkBlockchainWallet1 = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';

      await proxyWallet.wallets.addWalletFromPrivateKey(pkBlockchainWallet1);
      const { isAuthorized, authorizations } = await proxyWallet.wallets.checkBlockchainWalletAuthorizations();
      expect(isAuthorized).toBeTruthy();
      expect(authorizations).toHaveLength(1);
    });
  });
});
