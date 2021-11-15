import { Scope } from '@arianee/required';

const { requiredDefined } = Scope({ scopes: ['hashFromRoomIdSectionId'] });

/**
 * From sectionId and roomId return a hash
 * @param parameters
 */
export const hashFromRoomIdSectionId = (parameters:{
  roomId: string,
  sectionId: string,
}) => {
  const { roomId, sectionId } = parameters;
  requiredDefined(roomId, 'roomId should be defined');
  requiredDefined(sectionId, 'sectionId should be defined');
  return `${parameters.roomId}/${parameters.sectionId}`;
};
