import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { map } from 'rxjs/operators';
import { SectionState } from '../reducers/notifications/reducer';
import { cloneDeep } from 'lodash';

export const getSectionNewMessagesCount = (parameters: { roomId: string, sectionId: string }): number => {
  const {
    roomId,
    sectionId
  } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.sections.${sectionId}.newMessagesCount`;
  const property = getProperty(propertiesKey);
  return property || 0;
};
export const getSectionLastViewInfos = (parameters: { roomId: string, sectionId: string }): SectionState => {
  const {
    roomId,
    sectionId
  } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.sections.${sectionId}`;
  return cloneDeep(getProperty(propertiesKey));
};

export const hasSectionNewMessages = (parameters: { roomId: string, sectionId: string }): boolean => {
  return getSectionNewMessagesCount(parameters) > 0;
};

export const isFetched = (parameters: { roomId: string}): boolean => {
  const {
    roomId
  } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.status.isFetched`;
  const property = getProperty(propertiesKey);
  return property === true;
};

export const $newMessagesFromSection = (parameters: { roomId: string, sectionId: string }) => {
  const {
    roomId,
    sectionId
  } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.sections.${sectionId}.newMessagesCount`;
  return subscribeToProperty(propertiesKey);
};

export const $newMessagesFromRoom = (parameters: { roomId: string }) => {
  const { roomId } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}`;
  return subscribeToProperty(propertiesKey)
    .pipe(map((res:any) => res.sections));
};
