// @ts-nocheck
import { StrategyReturnPromise } from '../../models/strategyReturn';
import { Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { ContractAddresses, environment } from '../../environment/environment';
import { web3Factory } from '../helpers/web3Factory';
import { requiredDefined } from '../../helpers/required/required';

/** example
 [
    [
        {
            name: 'room-owner',
        }
    ]
 ]
 * @param web3Provider
 */

export const strategy = async (strategy: Strategy, tokenId:string): StrategyReturnPromise => {
  const web3Provider = await web3Factory(strategy.chainId);

  const contractAddress = ContractAddresses[strategy.chainId];
  requiredDefined(contractAddress, 'this chainId does not have a spkz nft contract');
  const roomContract = new web3Provider.eth.Contract(erc721ABI as any, contractAddress);
  const ownerOf = await roomContract.methods.ownerOf(tokenId).call().catch(() => null);
  const isAuthorized = strategy.addresses[0].toLowerCase() === ownerOf.toLowerCase();
  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTOWNER;
  const message = strategy.addresses[0] === ownerOf ? `You are the owner of Room #${tokenId}` : `You are not the owner of Room #${tokenId}`;

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code
  };
};
