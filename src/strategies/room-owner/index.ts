// @ts-nocheck
import { StrategyReturnPromise } from '../../models/strategyReturn';
import { RoomOwner, Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { ContractAddresses } from '../../environment/environment';
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

const getEnrichedInformation = async (strategy: Strategy<RoomOwner>):Promise<EnrichedInformations> => {
  const logo = 'https://raw.githubusercontent.com/Arianee/spkz-metadata/main/assets/spkz-logo.jpeg';

  return {
    logo,
    symbol: 'Lounge Owner',
    name: 'Lounge Owner'
  };
};

export const strategy = async (strategy: Strategy<RoomOwner>): StrategyReturnPromise => {
  const web3Provider = await web3Factory(strategy.params.chainId);
  const { tokenId } = strategy;
  const contractAddress = ContractAddresses[strategy.params.chainId];
  requiredDefined(contractAddress, 'this chainId does not have a spkz nft contract');
  requiredDefined(tokenId, 'this tokenId is not defined');

  let isAuthorized = false;
  let code;
  let message;
  if (strategy.addresses && strategy.addresses.length > 0) {
    const roomContract = new web3Provider.eth.Contract(erc721ABI as any, contractAddress);
    const ownerOf = await roomContract.methods.ownerOf(tokenId).call().catch(() => null);
    isAuthorized = strategy.addresses[0].toLowerCase() === ownerOf.toLowerCase();
    code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTOWNER;
    message = (strategy.addresses[0] && strategy.addresses[0] === ownerOf)
      ? `You are the owner of Room #${tokenId}`
      : `You are not the owner of Room #${tokenId}`;
  }

  const enrichedInformations = await getEnrichedInformation(strategy);

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    enrichedInformations
  };
};
