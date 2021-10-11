import { Lifecycle, scoped } from 'tsyringe';
import { network } from '../../../../models/network.enum';
import { getNetworkInfo } from '../../../../helpers/networkInfos/networkInfos.helper';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { Signaturev4 } from '../../../../models/signaturev4';

@scoped(Lifecycle.ContainerScoped)
export class MetamaskService {
  public accounts: string[];
  public defaultAccount: string;

  public hasMetamask;
  public currentChainId=137;

  private _window: any;

  constructor () {
    if (typeof window !== 'undefined') {
      this._window = window;
    }
  }

  public initMetamaskSilently = async (): Promise<void> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");

    if (this._window.ethereum) {
      this.hasMetamask = true;
      const isMMUnlock = await this._window.ethereum._metamask.isUnlocked();
      if (isMMUnlock) {
        const permissions = await this._window.ethereum.request({ method: 'wallet_getPermissions' });
        if (permissions.length > 0) {
          await this.initMetamask();
        }
      }
    }
  }

  public initMetamask = async (): Promise<void> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");

    if (this._window.ethereum) {
      this.accounts = await this._window.ethereum.request({ method: 'eth_requestAccounts' });
      this.defaultAccount = this.accounts[0];
      this.currentChainId = this._window.ethereum.chainId;
    }
  };

  public switchToNetwork = async (network: network): Promise<void> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");

    const networkInfo = await getNetworkInfo(network);

    this._window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${networkInfo.chainId.toString(16)}`,
        chainName: networkInfo.name,
        rpcUrls: networkInfo.rpc,
        nativeCurrency: networkInfo.nativeCurrency,
        blockExplorerUrls: networkInfo.explorers.map(explorer => explorer.url)
      }]
    });
  }

  public signData = (data: string): Promise<string> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");

    return this._window.ethereum.request({
      method: 'personal_sign',
      params: [this.defaultAccount, data]
    });
  }

  public signDatav4 = (data: Signaturev4): Promise<string> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");
    const payload = JSON.stringify(data);
    return this._window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [this.defaultAccount, payload]
    });
  }
}
