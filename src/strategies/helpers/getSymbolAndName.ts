import { ERC20BalanceOf } from '../../models/strategy';
import { web3Factory } from './web3Factory';
import { erc20ABI } from '../../abi/erc20.abi';
import { erc721ABI } from '../../abi/erc721.abi';
import { requiredDefined } from '../../helpers/required/required';
import web3 from 'web3';

const tryNumberToHexToUtf8 = (e:{value:any}, defaultValue:string) => {
  if (e.value) {
    try {
      return web3.utils.hexToUtf8(web3.utils.numberToHex(e.value));
    } catch (e) {
      return defaultValue;
    }
  } else {
    return defaultValue;
  }
};
export const getNameAdSymbolAndDecimalsERC20 = async (parameters: {
  chainId: string,
  address: string,
  default?: {
    name?: string,
    decimals?: string,
    symbol?: string
  }
}) => {
  const {
    chainId,
    address
  } = parameters;

  let defaultSymbol; let defaultDecimals; let defaultName;
  if (parameters.default) {
    defaultName = parameters.default.name;
    defaultSymbol = parameters.default.symbol;
    defaultDecimals = parameters.default.decimals;
  }

  requiredDefined(chainId, 'chainId must be defined');
  requiredDefined(address, 'contract address must be defined');

  const web3Provider = await web3Factory(chainId);
  const erc20SmartContracts = new web3Provider.eth.Contract(erc20ABI as any, address);

  const [symbol, decimals, name] = await Promise.all([
    erc20SmartContracts.methods.symbol().call().catch(e => tryNumberToHexToUtf8(e, defaultSymbol)),
    erc20SmartContracts.methods.decimals().call().catch(e => tryNumberToHexToUtf8(e, defaultDecimals)),
    erc20SmartContracts.methods.name().call().catch(e => tryNumberToHexToUtf8(e, defaultName))
  ]);

  return {
    symbol,
    decimals,
    name
  };
};

export const getNameAndSymbolERC721 = async (parameters: { chainId: string, address: string,
  default?: {
    name: string,
    symbol?: string
  }
}) => {
  const {
    chainId,
    address
  } = parameters;
  requiredDefined(chainId, 'chainId must be defined');
  requiredDefined(address, 'contract address must be defined');
  let defaultSymbol; let defaultName;
  if (parameters.default) {
    defaultName = parameters.default.name;
    defaultSymbol = parameters.default.symbol;
  }

  const web3Provider = await web3Factory(chainId);
  const erc20SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, address);

  const [symbol, name] = await Promise.all([
    erc20SmartContracts.methods.symbol().call().catch(e => tryNumberToHexToUtf8(e, defaultSymbol)),
    erc20SmartContracts.methods.name().call().catch(e => tryNumberToHexToUtf8(e, defaultName))
  ]);
  return {
    symbol,
    name
  };
};

export const getNameAndSymbolNative = async (parameters: { chainId: string,
  default?: {
    name: string,
    symbol?: string
  }
}) => {
  const {
    chainId
  } = parameters;
  requiredDefined(chainId, 'chainId must be defined');
  let defaultSymbol; let defaultName;
  if (parameters.default) {
    defaultName = parameters.default.name;
    defaultSymbol = parameters.default.symbol;
  }

  if (chainId === '1') {
    return {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18'
    };
  }

  if (chainId === '99') {
    return {
      symbol: 'POA',
      name: 'POA',
      decimals: '18'
    };
  }

  if (chainId === '137') {
    return {
      symbol: 'Matic',
      name: 'Matic',
      decimals: '18'
    };
  }
};
