import { AcquireUrls, EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import web3 from 'web3';
import { OpenseaCollectionBalanceOf, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import { abbreviateTokenBN } from '../../helpers/abbreviateNumberHelper/abbreviateHelper';
import axios from 'axios';
import { sumBN } from '../helpers/sumBN/sumBN';
import { requiredDefined } from '../../helpers/required/required';
import { retryExec } from '../../helpers/retryFactory/retryFactory';

const openSeaApiKey = '46bdef1fbc5e4b40b8295214c409355c';

const getOpenseaCollectionBalanceOf = async (address:string, collection:string, minBalance:string) => {
  const url = new URL('https://api.opensea.io/api/v1/assets');
  url.searchParams.set('owner', address);
  url.searchParams.set('limit', minBalance);
  url.searchParams.set('collection', collection);
  const result = await retryExec(axios.get(url.toString(), {
    headers: {
      'X-API-KEY': openSeaApiKey
    }
  }));
  return result.data.assets;
};

const calculateBalances = async (strategy: Strategy<OpenseaCollectionBalanceOf>): Promise<{ sum: string, minBalanceWithDecimals:string, minBalance:string, balances: { chainId: string, address: string, balanceOf: string }[] }> => {
  const { params } = strategy;

  const results = await Promise.all(strategy.addresses.map((address) => getOpenseaCollectionBalanceOf(address, params.collection, params.minBalance)));
  const balances = results.map(result => result.length);

  const minBalanceAbbreviated = abbreviateTokenBN(params.minBalance, '0');

  return {
    sum: sumBN(balances),
    balances: balances,
    minBalance: minBalanceAbbreviated.abbreviated,
    minBalanceWithDecimals: minBalanceAbbreviated.abbreviated
  };
};

export const strategy = async (strategy: Strategy<OpenseaCollectionBalanceOf>): StrategyReturnPromise => {
  const { params } = strategy;

  requiredDefined(params.collection, 'collection should be defined');
  requiredDefined(params.minBalance, 'min balance should be defined');

  const { collection } = (await axios.get(`https://api.opensea.io/api/v1/collection/${params.collection}`,
    {
      headers: {
        'X-API-KEY': openSeaApiKey
      }
    }
  )).data;
  const logo = collection.featured_image_url || collection.image_url;
  const name = collection.name;
  const symbol = collection.name;

  const balances = await calculateBalances(strategy);

  const amount = web3.utils.toBN(balances.sum);
  const minAmount = web3.utils.toBN(params.minBalance);

  const isAuthorized = amount.gte(minAmount);

  const message = minMaxMessage({
    symbol,
    decimals: 0,
    balance: balances.sum,
    amountRequired: params.minBalance
  });

  const minBalanceAbbreviated = abbreviateTokenBN(params.minBalance, '0');

  const details = {
    ...balances,
    minBalance: minBalanceAbbreviated.abbreviated,
    minBalanceWithDecimals: minBalanceAbbreviated.withoutDecimals
  };
  const code = isAuthorized ? ErrorCode.SUCCESS : ErrorCode.NOTENOUGH;
  let acquireURLs:AcquireUrls[] = [{ title: 'OpenSea', url: `https://opensea.io/collection/${params.collection}`, logo: 'https://opensea.io/static/images/logos/opensea.svg' }];
  if (strategy.acquireURLs) {
    acquireURLs = [...acquireURLs, ...strategy.acquireURLs];
  }

  const enrichedInformations:EnrichedInformations = {
    logo,
    symbol,
    name,
    acquireURLs
  };

  return {
    isAuthorized,
    strategy: strategy,
    message: message,
    code,
    details,
    enrichedInformations
  };
};
