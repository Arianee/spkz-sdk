import assert from 'assert';
import { StrategyReturnPromise } from '../../models/strategyReturn';
import { Strategy, ERC721OwnerOf } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { web3Factory } from '../helpers/web3Factory';

const ownerOf = async (erc721Contract, tokenId: string, userAddresses: string[]) : Promise<Boolean> => {
  const ownerOfTokenId = await erc721Contract.methods.ownerOf(tokenId).call().catch(() => '');
  return userAddresses.includes(ownerOfTokenId.toLowerCase());
};

/**
 * Check if an user owns one or more of the required NFTs
 * @param strategy the strategy params
 * @returns an authorized StrategyReturnPromise if the user owns all the required NFTs, an unauthorized one otherwise
 */
export const strategy = async (strategy: Strategy<ERC721OwnerOf>): StrategyReturnPromise => {
  const { params } = strategy;
  const { chainId, tokenIds } = params as ERC721OwnerOf;
  const erc721address = params.contract;
  const userAddresses = strategy.addresses.map(address => address.toLowerCase());

  assert(erc721address !== undefined, 'erc721 address is required');
  assert(chainId !== undefined, 'chainId is required');
  assert(tokenIds !== undefined, 'tokens is required');

  const web3Provider = await web3Factory(chainId);
  const contract = new web3Provider.eth.Contract(erc721ABI as any, erc721address);

  const isOwnerOfOneOrMore = (await Promise.all(tokenIds.map(tokenId => ownerOf(contract, tokenId, userAddresses)))).includes(true);

  const isAuthorized = isOwnerOfOneOrMore;

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTOWNER;
  const ids = tokenIds.map(tokenId => tokenId).join(', ');
  const message = isAuthorized ? `You are the owner of one or more of the NFTs : ${ids}` : `You do not own at least one of those NFTs : ${ids}`;

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code
  };
};
