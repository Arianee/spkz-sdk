import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import { UnlockHolderOf, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { requiredDefined } from '../../helpers/required/required';
import { web3Factory } from '../helpers/web3Factory';
import { lockABI } from '../../abi/lock.abi';

interface LockInfos {
  name: string;
  symbol: string;
  publicLockVersion: string;
}

const getLockInfos = async (chainId: string, address: string): Promise<LockInfos> => {
  requiredDefined(address, 'address of lock contract is required');
  requiredDefined(chainId, 'chainId of lock contract is required');

  const web3Provider = await web3Factory(chainId);

  const lockContract = new web3Provider.eth.Contract(lockABI as any, address);

  try {
    const [symbol, name, publicLockVersion] = await Promise.all([
      lockContract.methods.symbol().call().catch('LOCK'),
      lockContract.methods.name().call().catch('LOCK'),
      lockContract.methods.publicLockVersion().call().catch(null)
    ]);
    return {
      symbol,
      name,
      publicLockVersion
    };
  } catch (e) {
    return {
      symbol: null,
      name: null,
      publicLockVersion: null
    };
  }
};

/**
 * Balance of a Lock is either 0 (either no membership or expired) or 1 (valid membership)
 * @param chainId contract's chainid
 * @param contractAddress address of the lock contract
 * @returns 0, 1 or null
 */
const getBalanceOf = async (
  chainId: string,
  contractAddress: string,
  address: string
): Promise<number | null> => {
  requiredDefined(contractAddress, 'address of lock contract is required');
  requiredDefined(chainId, 'chainId of lock contract is required');

  const web3Provider = await web3Factory(chainId);

  const lockContract = new web3Provider.eth.Contract(lockABI as any, contractAddress);
  const balanceOf = await lockContract.methods.balanceOf(address).call().catch(null);

  return balanceOf ? parseInt(balanceOf) : null;
};

export const strategy = async (strategy: Strategy<UnlockHolderOf>): StrategyReturnPromise => {
  const { params } = strategy;
  requiredDefined(params.chainId, 'chainId should be defined');
  requiredDefined(params.address, 'address should be defined');

  const { symbol, name, publicLockVersion } = await getLockInfos(params.chainId, params.address);
  if (!publicLockVersion) {
    return {
      isAuthorized: false,
      strategy: strategy,
      message: 'This address is not a valid Lock contract',
      code: ErrorCode.ERRORINSTRATEGY
    };
  }

  const results = await Promise.all(
    strategy.addresses.map((address) => getBalanceOf(params.chainId, params.address, address))
  );

  const balances = results.filter((d) => d);
  const sum = balances.length;

  const message = minMaxMessage({
    symbol: `${symbol} (${name})`, // required because Lock symbol is always KEY
    decimals: 0,
    balance: sum,
    amountRequired: 1
  });

  const details = {
    sum: sum.toString(),
    minBalance: '1'
  };
  const isAuthorized = sum >= 1;

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;

  const enrichedInformations: EnrichedInformations = {
    symbol,
    name,
    logo:
      strategy.params.logo ||
      'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/default-icon.png'
  };

  return {
    isAuthorized,
    strategy: strategy,
    message,
    code,
    details,
    enrichedInformations
  };
};
