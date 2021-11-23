import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { map } from 'rxjs/operators';

export const hasSectionNewMessages = (parameters: { roomId: string, sectionId: string }): boolean => {
  const {
    roomId,
    sectionId
  } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.sections.${sectionId}.newMessagesCount`;
  const property = getProperty(propertiesKey);
  return property > 0;
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
