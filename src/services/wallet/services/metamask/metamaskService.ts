import { Lifecycle, scoped } from 'tsyringe';
import { network } from '../../../../models/network.enum';
import { getNetworkInfo } from '../../../../helpers/networkInfos/networkInfos.helper';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { Signaturev4 } from '../../../../models/signaturev4';
import WalletConnect from '@walletconnect/client';
import Web3 from 'web3';
import { IClientMeta, IWalletConnectOptions } from '@walletconnect/types';
import { ContractService } from '../../../utils/services/contractService/contractService';

@scoped(Lifecycle.ContainerScoped)
export class MetamaskService {
  private localStorageWalletConnectKey = 'walletconnect'
  public accounts: string[];
  public defaultAccount: string;

  public hasMetamask;
  public currentChainId=137;

  private _window: any;
  public connector: WalletConnect;

  constructor (private contractService:ContractService) {
    if (typeof window !== 'undefined') {
      this._window = window;
    }
  }

  public initMetamaskSilently = async (chainId?:string): Promise<void> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");
    if (this._window.ethereum) {
      this.hasMetamask = true;

      if (this._window.ethereum._metamask?.isUnlocked) {
        const isMMUnlock = await this._window.ethereum._metamask.isUnlocked();
        if (isMMUnlock) {
          await this.initMetamask();
        }
      } else {
        await this.initMetamask();
      }

      if (chainId && chainId.toString() !== parseInt(this.currentChainId.toString(), 16).toString()) {
        await this.switchToNetwork(chainId as any);
      }
    }
  }

  public getInstallationLink = (dappUrl:string): string => {
    requiredDefined(this._window, "You can't use metamask on nodejs");
    required(!dappUrl.includes('https'), 'You need to pass the url without the protocol');

    const isMobile = this.mobileAndTabletCheck();
    if (isMobile) {
      return `https://metamask.app.link/dapp/${dappUrl}`;
    }

    return 'https://metamask.io/';
  }

  private mobileAndTabletCheck () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

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

    await this._window.ethereum.request({
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

  public initMMWC = async (clientMeta?:IClientMeta): Promise<string> => {
    const connectorOptions:IWalletConnectOptions = {
      bridge: 'https://bridge.walletconnect.org'
    };
    if (clientMeta) {
      connectorOptions.clientMeta = clientMeta;
    }

    this.connector = new WalletConnect(connectorOptions);

    if (!this.connector.connected) {
      await this.connector.createSession();
    } else {
      this.defaultAccount = this.connector.accounts[0];
    }

    const url = new URL('https://metamask.app.link/wc');
    url.searchParams.set('uri', this.connector.uri);
    return url.toString();
  }

  public signWithWc = async (data) => {
    const web3 = new Web3();

    const msgParams = [
      web3.utils.utf8ToHex(data), // Required
      this.defaultAccount
    ];

    return this.connector
      .signPersonalMessage(msgParams);
  }

  public signData = (data: string): Promise<string> => {
    requiredDefined(this._window, "You can't use metamask on nodejs");

    return this._window.ethereum.request({
      method: 'personal_sign',
      params: [data, this.defaultAccount]
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

  public roomSmartContract () {
    return this.contractService.erc721Contract(this._window.ethereum);
  }

  public async killSession () {
    if (this.connector?.connected) {
      await this.connector.killSession();
    } else {
      localStorage.removeItem(this.localStorageWalletConnectKey);
    }
  }
}
