import { MessageService } from './messageService';

describe('message service', () => {
  test('we should receive an emited a message', () => {
    const messageService = new MessageService();
    const listener = jest.fn().mockReturnValue(true);

    messageService.messageEvent(listener);
    messageService.emitMessage('message');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('we should receive all emited a messages', () => {
    const messageService = new MessageService();
    const listener = jest.fn();

    messageService.messageEvent(listener);
    messageService.emitMessage('message');
    messageService.emitMessage('message');
    messageService.emitMessage('message');

    expect(listener).toHaveBeenCalledTimes(3);
  });

  test('we should receive message only after subscription', () => {
    const messageService = new MessageService();
    const listener = jest.fn();

    messageService.emitMessage('message');
    messageService.messageEvent(listener);
    messageService.emitMessage('message');
    messageService.emitMessage('message');

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
