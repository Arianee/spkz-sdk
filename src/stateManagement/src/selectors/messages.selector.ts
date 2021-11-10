import { getProperty, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { hashFromRoomIdSectionId } from '../helpers/hasFromRoomIdAndSectionId';

export const isWSInitilized = (parameters:{roomId:string, sectionId:string}):boolean => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.status.hasWSConnection`;
  const property = getProperty(propertiesKey);
  return !!property;
};

export const hasFetchInitialData = (parameters:{roomId:string, sectionId:string}):boolean => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.status.hasFetchedInitialMessages`;
  const property = getProperty(propertiesKey);
  return !!property;
};

export const nextTimestamp = (parameters:{roomId:string, sectionId:string}):number => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.status.nextTimestamp`;
  return getProperty(propertiesKey);
};

export const previousTimeStamp = (parameters:{roomId:string, sectionId:string}):number => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.status.previousTimestamp`;
  return getProperty(propertiesKey);
};

export const getMessages = (parameters:{roomId:string, sectionId:string}) => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.messages`;
  return getProperty(propertiesKey);
};
export const $messagesFromSection = (parameters:{roomId:string, sectionId:string}) => {
  const sectionHash = hashFromRoomIdSectionId(parameters);
  const propertiesKey = `${REDUCERNAME.MESSAGES}.${sectionHash}.messages`;
  return subscribeToProperty(propertiesKey);
};
