// @ts-nocheck
import { StrategyReturnPromise } from '../../models/strategyReturn';
import assert from 'assert';
import web3 from 'web3';
import { Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { environment } from '../../environment/environment';
import { web3Factory } from '../helpers/web3Factory';

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

  const roomContract = new web3Provider.eth.Contract(erc721ABI as any, environment.roomContractAddress);
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
