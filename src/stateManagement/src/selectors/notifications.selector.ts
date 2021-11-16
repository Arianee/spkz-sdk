import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { hashFromRoomIdSectionId } from '../helpers/hasFromRoomIdAndSectionId';

export const hasNewMessages = (parameters:{roomId:string, sectionId:string}):boolean => {
  const { roomId, sectionId } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.${sectionId}.newMessagesCount`;
  const property = getProperty(propertiesKey);
  return property > 0;
};

export const $newMessagesFromSection = (parameters:{roomId:string, sectionId:string}) => {
  const { roomId, sectionId } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}.${sectionId}.newMessagesCount`;
  return subscribeToProperty(propertiesKey);
};

export const $newMessagesFromRoom = (parameters:{roomId:string}) => {
  const { roomId } = parameters;
  const propertiesKey = `${REDUCERNAME.NOTIFICATIONS}.${roomId}`;
  return subscribeToProperty(propertiesKey);
};
