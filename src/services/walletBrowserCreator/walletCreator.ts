import { Wallet as etherWallet } from 'ethers';
import { isPrivateKeyValid } from '../../helpers/isPrivateKeyValid';
import { SPKZ } from '../wallet';
import { required, requiredDefined } from '../../helpers/required';

const key = 'messagingPrivateKey';

const createOrRetrieveWallet = () => {
  requiredDefined(window, '1/ this method is intended to be used on a browser');
  requiredDefined(window.localStorage, '2/ this method is intended to be used on a browser');

  let pk = window.localStorage.getItem(key);

  if (!pk) {
    pk = etherWallet.createRandom().privateKey;
    window.localStorage.setItem(key, pk);
  }

  if (isPrivateKeyValid(pk)) {
    return SPKZ.fromPrivateKey(pk);
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
