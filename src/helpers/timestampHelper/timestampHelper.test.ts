import { addDate } from './timestampHelper';

describe('timestamp helper', () => {
  describe('add days', () => {
    const fixedTimestamp = 1632121835271;

    test('days', () => {
      expect(addDate(3, 'days', fixedTimestamp)).toBe(1632381035271);
    });
    test('minutes', () => {
      expect(addDate(3, 'minutes', fixedTimestamp)).toBe(1632122015271);
    });
    test('seconds', () => {
      expect(addDate(3, 'seconds', fixedTimestamp)).toBe(1632121838271);
    });
  });
});
