import { createOrRetrieveWallet } from '../../src/services/walletBrowserCreator/walletCreator';
import { network } from '../../src/services/wallet/index';
import { clearWallet } from '../../src';

declare const window:any;

(async () => {
  const spkz = createOrRetrieveWallet();
  await spkz.metamaskService.initMetamaskSilently();
  setAddressInFront(spkz.metamaskService.defaultAccount);

  window.connectMetamask = async () => {
    await spkz.metamaskService.initMetamask();
    setAddressInFront(spkz.metamaskService.defaultAccount);
  };

  window.switchNetwork = async () => {
    await spkz.metamaskService.switchToNetwork(network.mumbai);
  };

  window.addMMWallet = async () => {
    await spkz.wallets.addFromMetamask();
  };

  window.clearLocalStorage = () => {
    clearWallet();
  };

  function setAddressInFront (address:string) {
    document.getElementById('walletAddress').innerText = address;
  }
})();
