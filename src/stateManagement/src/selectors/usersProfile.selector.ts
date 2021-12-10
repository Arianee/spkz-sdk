import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { UserProfileFromStore, UserProfileToSend } from '../../../models/userProfile/userProfile';
import { Observable } from 'rxjs';
import { Scope } from '@arianee/required';
import { UserProfileRPC } from '../../../models/userProfile/userProfileRPC';

const scope = Scope({ scopes: ['users', 'selector'] });

export const getUserProfileFromRoom = (parameters: { roomId: string, address: string }): UserProfileFromStore => {
  const {
    roomId,
    address
  } = parameters;

  const { requiredDefined } = scope.subScope('getUserProfileFromRoom');
  requiredDefined(roomId, 'roomId is required');
  requiredDefined(address, 'address is required');

  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}.${address.toLowerCase()}`;
  return getProperty(propertiesKey);
};

export const subcribeToOneProfileOfRoom = (parameters:{roomId, address:string}):Observable<UserProfileFromStore> => {
  const { requiredDefined } = scope.subScope('subcribeToOneProfileOfRoom');
  const { roomId, address } = parameters;
  requiredDefined(roomId, 'roomId is required');
  requiredDefined(address, 'address is required');

  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}.${address.toLowerCase()}`;

  return subscribeToProperty(propertiesKey);
};

export const subcribeToAllProfileOfRoom = (parameters:{roomId}):Observable<{address:UserProfileFromStore}> => {
  const { requiredDefined } = scope.subScope('subcribeToAllProfileOfRoom');

  const { roomId } = parameters;
  requiredDefined(roomId, 'roomId is required');
  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}`;

  return subscribeToProperty(propertiesKey);
};
