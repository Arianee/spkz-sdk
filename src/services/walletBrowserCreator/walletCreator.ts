import { Wallet as etherWallet } from 'ethers';
import { isPrivateKeyValid } from '../../helpers/isPrivateKeyValid/isPrivateKeyValid';
import { SPKZ } from '../wallet';
import { requiredDefined } from '../../helpers/required/required';
import { SpkzConfiguration } from '../../models/spkzConfiguration';

const key = 'spkz_proxyWalletPK';

const createOrRetrieveWallet = (configuration?:SpkzConfiguration) => {
  requiredDefined(window, '1/ this method is intended to be used on a browser');
  requiredDefined(window.localStorage, '2/ this method is intended to be used on a browser');

  let pk = window.localStorage.getItem(key);

  if (!pk) {
    pk = etherWallet.createRandom().privateKey;
    window.localStorage.setItem(key, pk);
  }

  if (isPrivateKeyValid(pk)) {
    const spkz = SPKZ.fromPrivateKey(pk);
    if (configuration) {
      spkz.environmentService.spkzConfiguration = configuration;
    }
    return spkz;
  } else {
    throw new Error('private key is not valid');
  }
};

const clearWallet = () => {
  window.localStorage.removeItem(key);
  return createOrRetrieveWallet();
};

export {
  clearWallet,
  createOrRetrieveWallet
};
