import { AsyncFunc } from '../AsyncFunc';
import {
  ReadMessageParameters,
  RoomUser,
  SectionUser,
  SectionUserGet,
  WriteMessageParameters
} from './writeMessageParameters';
import { BouncerUser, BouncerUserQuery } from './bouncer';

export interface SectionUserParameters{
    joinSection: AsyncFunc<SectionUser, any>,
    createOrUpdateProfile:AsyncFunc<SectionUser, any>,
    getUsers:AsyncFunc<SectionUserGet, SectionUser[]>,
    updateLatViewed:AsyncFunc<SectionUser, any>
}

export interface MessageParameters{
    read: AsyncFunc<ReadMessageParameters, any>,
    write: AsyncFunc<WriteMessageParameters, any>,
}

export interface BouncerParameters
{
    getMyProfile: AsyncFunc<BouncerUserQuery, BouncerUser>,
    getUserRooms: AsyncFunc<BouncerUserQuery, RoomUser[]>,
    joinRoom: AsyncFunc<RoomUser>,
    updateProfile: AsyncFunc<BouncerUser, BouncerUser>
}
