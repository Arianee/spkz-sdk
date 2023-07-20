import { Lifecycle, scoped } from 'tsyringe';
import { network } from '../../../../models/network.enum';
import { getNetworkInfo } from '../../../../helpers/networkInfos/networkInfos.helper';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { Signaturev4 } from '../../../../models/signaturev4';
import { ContractService } from '../../../utils/services/contractService/contractService';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { ethers } from 'ethers';

@scoped(Lifecycle.ContainerScoped)
export class MetamaskService {
  private localStorageWalletConnectKey = 'walletconnect'
  public accounts: string[];
  public defaultAccount: string;

  public hasMetamask;
  public currentChainId=137;

  private _window: any;
  web3ModalEthereumProvider: any;
  projectId = '161a26cf3fa8e9340f7d0c153dcd2b64';
  provider?: ethers.providers.Web3Provider;
  isConnected: boolean;

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

  public initWC = async (): Promise<void> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      if (this.isConnected) {
        console.info('[Web3ModalV2Connector] Already connected');
        return;
      }

      try {
        this.web3ModalEthereumProvider =
          await EthereumProvider.init({
            projectId: this.projectId,
            showQrModal: true,
            chains: [1],
            methods: ['personal_sign'],
            events: ['chainChanged', 'accountsChanged'],
            metadata: {
              name: 'SPKZ',
              description: 'SPKZ by Arianee',
              url: 'https://arian.ee/',
              icons: ['']
            }
          });
        // 6. Set up connection listener
        this.web3ModalEthereumProvider.on('connect', async () => {
          this.isConnected = true;
          this.provider = new ethers.providers.Web3Provider(
            this.web3ModalEthereumProvider
          );
          this.defaultAccount = (await this.provider.listAccounts())[0];
          console.info('[Web3ModalV2Connector] Connected with ', this.defaultAccount);
          resolve();
        });
        await this.web3ModalEthereumProvider.connect();
      } catch (err) {
        reject(err);
      }
    });
  }

  public getDefaultAccountFromWalletConnect () {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this.defaultAccount) {
        return resolve(this.defaultAccount);
      } else {
        this.defaultAccount = (await this.provider.listAccounts())[0];
        return resolve(this.defaultAccount);
      }
    });
  }

  public signWithWc = async (data) : Promise<string> => {
    if (!this.web3ModalEthereumProvider) { throw new Error('Web3Modal is not initialized'); }
    if (!this.isConnected) {
      await this.initWC();
    }
    console.info(
      '[Web3ModalConnector] Init Signed: { message: "%s" }',
      data
    );

    return this.provider!.getSigner().signMessage(data);
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
    if (this.isConnected) {
      if (!this.web3ModalEthereumProvider) { throw new Error('Web3ModalEthereumProvider is not initialized'); }

      this.web3ModalEthereumProvider.disconnect();
      // Remove WalletConnect session from local storage
      localStorage.removeItem('walletconnect');

      this.isConnected = false;

      console.info('[Web3ModalV2Connector] Disconnected');
    } else {
      localStorage.removeItem(this.localStorageWalletConnectKey);
    }
  }
}
