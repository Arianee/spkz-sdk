import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { UserProfile } from '../../../models/userProfile';
import { combineLatest, Observable } from 'rxjs';
import { Scope } from '@arianee/required';

import { map } from 'rxjs/operators';

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

export const subcribeToAllProfileOfRoom = (parameters:{roomId}):Observable<{address:UserProfile}> => {
  const { requiredDefined } = scope.subScope('subcribeToAllProfileOfRoom');

  const { roomId } = parameters;
  requiredDefined(roomId, 'roomId is required');
  const propertiesKey = `${REDUCERNAME.USERS}.${roomId}`;

  return subscribeToProperty(propertiesKey);
};

export const subscribeToSectionMemberWithProfle = (parameters:{roomId, sectionId:string}):Observable<UserProfile[]> => {
  const $sectionMembers = subcribeSectionMembers(parameters);
  const $subcribeToAllProfileOfRoom = subcribeToAllProfileOfRoom(parameters);

  return combineLatest([$sectionMembers, $subcribeToAllProfileOfRoom])
    .pipe(map(([sectionMember, userProfile]) =>
      sectionMember
        .map(address => userProfile[address])));
};
