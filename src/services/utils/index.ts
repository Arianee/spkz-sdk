// fetch room
// rights
import 'reflect-metadata';
import { RightService } from './services/rightService/rightService';
import { container } from 'tsyringe';
import { FetchRoomService } from './services/fetchRoomService/fetchRoomService';

const childContainer = container.createChildContainer();

export const utils = {
  rightService: childContainer.resolve(RightService),
  fetchRoomService: childContainer.resolve(FetchRoomService)
};
