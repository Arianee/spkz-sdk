import { createOrRetrieveWallet } from '../../../walletBrowserCreator/walletCreator';
import { JWTGeneric } from '../../../../helpers/JWTGeneric/JWTGeneric';
import { signerDecoder } from '../../../../helpers/JWTGeneric/signerAndDecoderFromPrivateKey';

describe('messagingWallet', () => {
  test('blockchain wallet', async () => {
    const pk = '0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161';
    const messagingWallet = createOrRetrieveWallet();
    expect(messagingWallet.wallets.authorizations).toHaveLength(0);

    await messagingWallet.wallets.addWalletFromPrivateKey(pk);

    expect(messagingWallet.wallets.authorizations).toHaveLength(1);
    const { signer, decoder, address } = signerDecoder('0xc88c2ebe8243c838b54fcafebef2ae909556c8f96becfbbe4a2d49a9417c4161');
    const genericJWT = new JWTGeneric(signer, decoder);
    const verify = genericJWT.setToken(messagingWallet.wallets.authorizations[0]).verify(address);
    expect(verify).toBeTruthy();

    expect(messagingWallet.wallets.authorizedAddresses).toHaveLength(1);
    await messagingWallet.wallets.addWalletFromPrivateKey(pk);
    expect(messagingWallet.wallets.authorizedAddresses).toHaveLength(1);
  });
});
