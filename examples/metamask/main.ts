import { createOrRetrieveWallet, clearWallet } from '../../src';
import { network } from '../../src/models/network.enum';

declare const window:any;
const roomId = '0';
(async () => {
  const spkz = createOrRetrieveWallet();
  spkz.environmentService.swithEnv('dev');
  await spkz.metamaskService.initMetamaskSilently();
  setAddressInFront(spkz.metamaskService.defaultAccount);

  window.getMessage = async () => {
    //const message = await spkz.room.fetchMessages({ roomId: roomId, sectionId: 'chat' });
  };

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

  };
  window.sendMessage = () => {
    const content = (<HTMLInputElement>document.getElementById('messageContent')).value;
    //spkz.room.sendMessage({ roomId: roomId, sectionId: 'chat', messageContent: { content } });
  };

  const verifiedId = await spkz.bouncer.getVerifiedRoomsId();
  console.log(verifiedId);

  function setAddressInFront (address:string) {
    document.getElementById('walletAddress').innerText = address;
  }
})();
