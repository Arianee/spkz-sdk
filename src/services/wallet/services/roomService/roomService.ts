import { Lifecycle, scoped } from 'tsyringe';
import { MessageService } from '../messageService/messageService';
import { UserAndProfileService } from '../userAndProfileService/userAndProfileService';
import { UsersService } from '../usersService/usersService';
import { RightUtilsService } from '../rightUtilsService/rightUtilsService';

@scoped(Lifecycle.ContainerScoped)
export class RoomService {
  constructor (
    private messageService: MessageService,
    private userAndProfileService: UserAndProfileService,
    private usersService: UsersService,
    private rightUtilsService: RightUtilsService
  ) {
  }

  public message = this.messageService;
  public userAndProfile = this.userAndProfileService;
  public users = this.usersService;
  public rightUtils = this.rightUtilsService;
}
