// fetch room
// rights
import { RightService } from './services/rightService/rightService';
import { container } from 'tsyringe';

const childContainer = container.createChildContainer();
export const utils = {
  rightService: childContainer.resolve(RightService)
};
