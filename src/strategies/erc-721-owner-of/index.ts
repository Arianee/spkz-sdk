// @ts-nocheck
import { StrategyReturnPromise } from '../../models/strategyReturn';
import assert from 'assert';
import web3 from 'web3';
import { Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';

/** example
 [
    [
        {
            chainId:'77',
            name: 'erc-721-owner-of',
            address: wallet.address,
            params: {
               tokenId:1234,
                address: '0xB81AFe27c103bcd42f4026CF719AF6D802928765'
            }
        }
    ]
 ]
 * @param web3Provider
 */
export const strategy = (web3Provider: web3) =>
  async (strategy: Strategy): StrategyReturnPromise => {
    const { params, address } = strategy;

    assert(params.address !== undefined, 'erc20 address is required');
    assert(params.tokenId !== undefined, 'tokenId is required');

    const erc721Address = params.address;
    const erc721SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, erc721Address);

    const ownerOf = await erc721SmartContracts.methods.ownerOf(params.tokenId).call().catch(() => null);

    const isAuthorized = address.toLowerCase() === ownerOf.toLowerCase();
    const code = isAuthorized ? ErrorCode.SUCESS : ErrorCode.NOTOWNER;
    const message = address === ownerOf ? `You are the owner of ${params.tokenId}` : `You are not the owner of ${params.tokenId}`;

    return {
      isAuthorized,
      strategy: strategy,
      message: message,
      code
    };
  };
