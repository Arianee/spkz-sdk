import { clearWallet, createOrRetrieveWallet } from './walletCreator';

describe('Wallet Creator', () => {
  test('should be able to create wallet and retrieve same wallet', () => {
    const wallet1 = createOrRetrieveWallet();
    const wallet2 = createOrRetrieveWallet();
    expect(wallet1.privateKey).toBeDefined();
    expect(wallet2.privateKey).toBeDefined();

    expect(wallet1.privateKey).toBe(wallet2.privateKey);
  });

  test(' should be able reset wallet if I already had one', () => {
    const wallet1 = createOrRetrieveWallet();
    const wallet2 = clearWallet();
    expect(wallet2.privateKey).toBeDefined();
    expect(wallet1.privateKey !== wallet2.privateKey).toBeTruthy();
  });
});
