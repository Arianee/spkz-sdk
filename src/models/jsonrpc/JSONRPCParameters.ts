import { AsyncFunc } from '../AsyncFunc';
import {
  NewMessageCount, NewMessageCountParameters,
  ReadMessageParameters, ReadMessageReturn,
  RoomUser,
  SectionUser,
  SectionUserGet,
  WriteMessageParameters
} from './writeMessageParameters';
import { BouncerUser, BouncerUserQuery, NotificationPreferences } from './bouncer';

export interface SectionUserParameters {
  joinSection: AsyncFunc<SectionUser, any>,
  createOrUpdateProfile: AsyncFunc<SectionUser, any>,
  getUsers: AsyncFunc<SectionUserGet, SectionUser[]>,
  updateLastViewed: AsyncFunc<SectionUser, any>
}

export interface MessageParameters {
  read: AsyncFunc<ReadMessageParameters, ReadMessageReturn>,
  write: AsyncFunc<WriteMessageParameters, any>,
  newMessage?: AsyncFunc<NewMessageCountParameters, NewMessageCount[]>,
}

export interface BouncerParameters {
  getMyProfile: AsyncFunc<BouncerUserQuery, BouncerUser>,
  getUserRooms: AsyncFunc<BouncerUserQuery, RoomUser[]>,
  joinRoom: AsyncFunc<RoomUser>,
  updateProfile: AsyncFunc<BouncerUser, BouncerUser>,
  updateNotificationPreferences: AsyncFunc<NotificationPreferences, NotificationPreferences>,
}
