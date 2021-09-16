import { hello } from './index';

describe('first test', () => {
  test('should return hello', () => {
    expect(hello()).toBe('World');
  });
});
