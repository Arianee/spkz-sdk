import { sumBN } from './sumBN';

describe('sumBN', () => {
  test('it should sum', () => {
    expect(sumBN([
      '120000000000000000000',
      '120000000000000000000'
    ])).toBe('240000000000000000000'); ;
  });
});
