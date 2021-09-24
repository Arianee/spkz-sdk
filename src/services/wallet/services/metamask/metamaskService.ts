import { Lifecycle, scoped } from 'tsyringe';
import { network } from '../../../../models/network.enum';
import { getNetworkInfo } from '../../../../helpers/networkInfos/networkInfos.helper';

@scoped(Lifecycle.ContainerScoped)
export class MetamaskService {
  public accounts: string[];
  public defaultAccount: string;

  public hasMetamask;
  public currentChainId;

  private _window: any = window;

  public initMetamaskSilently = async (): Promise<void> => {
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
    if (this._window.ethereum) {
      this.accounts = await this._window.ethereum.request({ method: 'eth_requestAccounts' });
      this.defaultAccount = this.accounts[0];
      this.currentChainId = this._window.ethereum.chainId;
    }
  };

  public switchToNetwork = async (network: network): Promise<void> => {
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
    return this._window.ethereum.request({
      method: 'personal_sign',
      params: [this.defaultAccount, data]
    });
  }
}
