import { REDUCERNAME } from '../reducerName';
import { subscribeToProperty } from '../utilityMapper/utilities';

export const userRooms = ():number => {
  const propertiesKey = `${REDUCERNAME.USERROOMS}`;
  return subscribeToProperty(propertiesKey);
};
