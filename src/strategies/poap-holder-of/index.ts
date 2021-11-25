import { EnrichedInformations, StrategyReturnPromise } from '../../models/strategyReturn';
import { PoapHolderOf, Strategy } from '../../models/strategy';
import { ErrorCode } from '../../models/errorCode';
import { minMaxMessage } from '../helpers/messageHelper';
import axios from 'axios';
import { requiredDefined } from '../../helpers/required/required';

const getOpenseaCollectionBalanceOf = async (address:string, eventId:string) => {
  const url = new URL(`https://api.poap.xyz/actions/scan/${address}/${eventId}`);
  try {
    const result = await axios.get(url.toString());
    return result.data;
  } catch (e) {
    return null;
  }
};

const getPoapDescription = (eventId:string) => {
  const url = `https://api.poap.xyz/events/id/${eventId}`;
  return axios.get(url.toString()).then(d => d.data).catch();
};

export const strategy = async (strategy: Strategy<PoapHolderOf>): StrategyReturnPromise => {
  const { params } = strategy;
  requiredDefined(params.eventId, 'eventId should be defined');

  try {
    const results = await Promise.all(strategy.addresses.map((address) => getOpenseaCollectionBalanceOf(
      address,
      params.eventId)));

    const userPoaps = results.filter(d => d);
    const sum = userPoaps.length;
    const firstPoap = userPoaps;

    const poapEvent = userPoaps.length > 0 ? userPoaps[0].event : await getPoapDescription(params.eventId);

    const { name, image_url: logo } = poapEvent;
    const symbol = name;

    const message = minMaxMessage({
      symbol,
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

    const enrichedInformations:EnrichedInformations = {
      logo,
      symbol,
      name
    };

    return {
      isAuthorized,
      strategy: strategy,
      message: message,
      code,
      details,
      enrichedInformations
    };
  } catch (e) {
    return {
      isAuthorized: false,
      strategy: strategy,
      message: 'this eventId does not exist',
      code: ErrorCode.ERRORINSTRATEGY
    };
  }
};
