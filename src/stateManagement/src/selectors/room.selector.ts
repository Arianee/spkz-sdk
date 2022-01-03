import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { Scope } from '@arianee/required';
import { RoomFromStore } from '../../../models/room/recommendedAndFeaturedRoom';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isEqual } from 'lodash';

const scope = Scope({ scopes: ['users', 'selector'] });

export const getRoomMembersCount = (parameters: { roomId: string }) => {
  const {
    roomId
  } = parameters;
  const { requiredDefined } = scope.subScope('getRoomMemberCount');
  requiredDefined(roomId, 'roomId is required');

  const propertiesKey = `${REDUCERNAME.ROOM}.${roomId}.membersNb`;
  return getProperty(propertiesKey);
};

export const getRoom = (parameters: { roomId: string }): RoomFromStore => {
  const {
    roomId
  } = parameters;

  const { requiredDefined } = scope.subScope('getRoom');
  requiredDefined(roomId, 'roomId is required');

  const propertiesKey = `${REDUCERNAME.ROOM}.${roomId}`;
  return getProperty(propertiesKey);
};

export const $subscribeFilteredRoomsFactory = (propertyName:string):Observable<RoomFromStore[]> => {
  const propertiesKey = `${REDUCERNAME.ROOM}`;

  return subscribeToProperty(propertiesKey)
    .pipe(map((p:{[roomId:string]:RoomFromStore}) => {
      const recommendedRooms = [];
      for (var key in p) {
        if (p[key][propertyName]) {
          recommendedRooms.push(p[key]);
        }
      }
      return recommendedRooms;
    }),
    distinctUntilChanged(isEqual)
    );
};
export const $subscribeRecommendedRooms = () => $subscribeFilteredRoomsFactory('recommended');
export const $subscribeFeaturedRooms = () => $subscribeFilteredRoomsFactory('featured');

export const $subscribeToRoom = (parameters: { roomId: string }):Observable<RoomFromStore> => {
  const {
    roomId
  } = parameters;
  const { requiredDefined } = scope.subScope('getRoomMemberCount');
  requiredDefined(roomId, 'roomId is required');

  const propertiesKey = `${REDUCERNAME.ROOM}.${roomId}`;

  return subscribeToProperty(propertiesKey);
};
