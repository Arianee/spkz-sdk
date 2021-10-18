import { Lifecycle, scoped } from 'tsyringe';
import { FetchRoomService } from '../../../utils/services/fetchRoomService/fetchRoomService';
import { executeStrategies } from '../../../../strategies/executeStrategy';
import { RightService } from '../../../utils/services/rightService/rightService';

@scoped(Lifecycle.ContainerScoped)
export class StrategiesService {
  constructor (private rightService: RightService, private fetchRoomService: FetchRoomService) {

  }
}
