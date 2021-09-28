import { createOrRetrieveWallet, clearWallet } from '../../src';
import { network } from '../../src/models/network.enum';


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
  window.joinRoom = () => {
    spkz.room.joinNotificationserver({ roomId: '0', sectionId: 'chat' });
  };

  function setAddressInFront (address:string) {
    document.getElementById('walletAddress').innerText = address;
  }

  function joinRoom () {

  }
})();
