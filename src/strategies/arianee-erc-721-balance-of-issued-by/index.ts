// @ts-nocheck
import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import { ArianeeERC721BalancesOfIssuedBy, Strategy } from '../../models/strategy';
import { erc721ABI } from '../../abi/erc721.abi';
import { ErrorCode } from '../../models/errorCode';
import { requiredDefined, requiredType } from '../../helpers/required/required';
import { web3Factory } from '../helpers/web3Factory';
import { flattenDeep, range } from 'lodash';
import { getNameAndSymbolERC721 } from '../helpers/getSymbolAndName';
import { minMaxMessage } from '../helpers/messageHelper';
import web3 from 'web3';
import { sumBN } from '../helpers/sumBN/sumBN';

const getBalanceOfIssuedBy = async (params: ArianeeERC721BalancesOfIssuedBy, issuer:string, addresses:string[]): Promise<{
  chainId: string, address: string, balanceOf: string }[]> => {
  const { address: ERC71Address, chainId } = params;
  requiredDefined(ERC71Address, 'address of token is required');
  requiredDefined(chainId, 'chainId of token is required');
  requiredDefined(issuer, 'chainId of token is required');
  requiredType(addresses, 'array', 'addresses must be defined');

  const web3Provider = await web3Factory(chainId);
  const erc721SmartContracts = new web3Provider.eth.Contract(erc721ABI as any, ERC71Address);
  const result = await Promise.all(addresses.map(async walletAddress => {
    const numberOfTokens = await erc721SmartContracts.methods.balanceOf(walletAddress).call();
    const tokensOwnerIssuedby = await Promise.all(range(numberOfTokens)
      .map(async tokenIndex => {
        const tokenId = await erc721SmartContracts.methods.tokenOfOwnerByIndex(walletAddress, tokenIndex).call();
        const tokenIssuer:string = await erc721SmartContracts.methods.issuerOf(tokenId).call();
        return tokenIssuer.toLowerCase() === issuer.toLowerCase();
      }));

    return {
      chainId,
      address: walletAddress,
      balanceOf: tokensOwnerIssuedby.filter(d => d).length.toString()
    };
  }));

  return flattenDeep(result);
};

const getBalances = async (strategy:Strategy<ArianeeERC721BalancesOfIssuedBy>) : Promise<{ sum: string, balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { tokens } = strategy.params;
  const balances = await Promise.all(tokens.map(token => getBalanceOfIssuedBy(token, strategy.params.issuer, strategy.addresses)));

  const flatBalances = flattenDeep(balances);
  const sum = sumBN(flatBalances.map(d => d.balanceOf));

  return {
    balances,
    sum
  };
};

export const strategy = async (strategy: Strategy<ArianeeERC721BalancesOfIssuedBy>): StrategyReturnPromise => {
  const { params } = strategy;
  const firstToken = params.tokens[0];
  let symbol, name;
  if (params.name && params.symbol) {
    symbol = params.symbol;
    name = params.name;
  } else {
    const result = await getNameAndSymbolERC721({
      address: firstToken.address,
      chainId: firstToken.chainId,
      default: {
        name: params.name,
        symbol: params.symbol
      }
    });

    symbol = result.symbol;
    name = result.name;
  }

  const balances = await getBalances(strategy);
  const amount = web3.utils.toBN(balances.sum);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    name,
    decimals: 0,
    balance: balances.sum,
    amountRequired: params.minBalance
  });

  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;

  const enrichedInformations: EnrichedInformations = {
    symbol: symbol,
    name: name,
    logo: strategy.params.logo,
    acquireURLs: strategy.acquireURLs
  };

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    enrichedInformations,
    details: balances
  };
};
