import { Lifecycle, scoped } from 'tsyringe';
import { EventEmitter } from 'eventemitter3';

@scoped(Lifecycle.ContainerScoped)
export class InternalMessageEventEmitterService {
  private messages = new EventEmitter()

  public messageEvent = (cb:(message:string)=>{}):void => {
    this.messages.on('spkz-message', cb);
  }

  public emitMessage = (message) => {
    this.messages.emit('spkz-message', message);
  }

  public userJoinSectionEvent = (cb:(user:string)=>{}):void => {
    this.messages.on('userJoinSection', cb);
  }

  public emitUserJoinSection = (user) => {
    this.messages.emit('userJoinSection', user);
  }
}
