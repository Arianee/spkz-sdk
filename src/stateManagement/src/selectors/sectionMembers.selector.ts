import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { UserProfileFromStore, UserProfileToSend } from '../../../models/userProfile/userProfile';
import { combineLatest, Observable } from 'rxjs';
import { Scope } from '@arianee/required';
import { get, isEqual } from 'lodash';
import { distinctUntilChanged, map } from 'rxjs/operators';

const scope = Scope({ scopes: ['sectionMembers', 'selector'] });

export const getSectionMember = (parameters: { roomId: string, sectionId: string }): string[] => {
  const {
    roomId,
    sectionId
  } = parameters;

  const { requiredDefined } = scope.subScope('getSectionMember');
  requiredDefined(roomId, 'roomId is required');
  requiredDefined(sectionId, 'sectionId is required');

  const propertiesKey = `${REDUCERNAME.SECTIONMEMBER}.${roomId}.${sectionId.toLowerCase()}`;
  return getProperty(propertiesKey);
};

export const subcribeSectionMembers = (parameters:{roomId, sectionId:string}):Observable<string[]> => {
  const {
    roomId,
    sectionId
  } = parameters;

  const { requiredDefined } = scope.subScope('subcribeSectionMembers');
  requiredDefined(roomId, 'roomId is required');
  requiredDefined(sectionId, 'sectionId is required');

  const propertiesKey = `${REDUCERNAME.SECTIONMEMBER}.${roomId}.${sectionId.toLowerCase()}`;
  return subscribeToProperty(propertiesKey);
};

export const subcribeToAllProfileOfRoom = (parameters:{roomId}):Observable<{address:UserProfileToSend}> => {
  const { requiredDefined } = scope.subScope('subcribeToAllProfileOfRoom');

  const { roomId } = parameters;
  requiredDefined(roomId, 'roomId is required');
  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}`;

  return subscribeToProperty(propertiesKey);
};

export const subscribeToOneSectionMemberWithProfle = (parameters:{roomId, sectionId?:string, address:string}):Observable<UserProfileFromStore> => {
  const { requiredDefined } = scope.subScope('subscribeToOneSectionMemberWithProfle');

  const { roomId, address } = parameters;

  requiredDefined(roomId, 'roomId is required');
  requiredDefined(address, 'address is required');
  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}.${address.toLowerCase()}`;

  return subscribeToProperty(propertiesKey);
};

export const subscribeToSectionMemberWithProfle = (parameters:{roomId, sectionId:string}):Observable<UserProfileFromStore[]> => {
  const $sectionMembers = subcribeSectionMembers(parameters);
  const $subcribeToAllProfileOfRoom = subcribeToAllProfileOfRoom(parameters);

  return combineLatest([$sectionMembers, $subcribeToAllProfileOfRoom])
    .pipe(
      map(([sectionMember, userProfile]) => {
        return sectionMember
          .sort()
          .map(address => get(userProfile, address))
          .filter(d => d);
      }),
      distinctUntilChanged(isEqual)
    );
};
