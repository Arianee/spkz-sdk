import { Lifecycle, scoped } from 'tsyringe';
import { EventEmitter } from 'eventemitter3';

@scoped(Lifecycle.ContainerScoped)
export class MessageService {
  private messages = new EventEmitter()

  public messageEvent = (cb:(message:string)=>{}):void => {
    this.messages.on('spkz-message', cb);
  }

  public emitMessage = (message) => {
    this.messages.emit('spkz-message', message);
  }
}
