import { abbreviateStringNumber, abbreviateTokenBN } from './abbreviateHelper';

describe('abbreviate helper', () => {
  test('should return k for 1000', () => {
    expect(abbreviateStringNumber('1000')).toBe('1K');
    expect(abbreviateStringNumber('9999')).toBe('9.999K');

    expect(abbreviateStringNumber('10000')).toBe('10K');
    expect(abbreviateStringNumber('100000')).toBe('100K');
  });
  test('should return M for 1000', () => {
    expect(abbreviateStringNumber('1000000')).toBe('1M');
    expect(abbreviateStringNumber('1500000')).toBe('1.5M');
    expect(abbreviateStringNumber('1500000.000001')).toBe('1.5M');

    expect(abbreviateStringNumber('10000000')).toBe('10M');
    expect(abbreviateStringNumber('100000000')).toBe('100M');
  });
  test('should return B for 1000', () => {
    expect(abbreviateStringNumber('1000000000')).toBe('1B');
    expect(abbreviateStringNumber('10000000000')).toBe('10B');
    expect(abbreviateStringNumber('100000000000')).toBe('100B');
  });

  test('should return for 0 number', () => {
    expect(abbreviateStringNumber('0.0')).toBe('0');
    expect(abbreviateStringNumber('0')).toBe('0');
  });

  test('should return for small number', () => {
    expect(abbreviateStringNumber('0.00001')).toBe('few');
    expect(abbreviateStringNumber('0.001')).toBe('0.001');
    expect(abbreviateStringNumber('0.0020001')).toBe('0.002');
  });
  describe('abbreviateTokenBN', () => {
    test('should return for very big number', () => {
      const { withDecimals, withoutDecimals, abbreviated } = abbreviateTokenBN('100000000000000000000000', '18');
      expect(withDecimals).toBe('100000000000000000000000');
      expect(withoutDecimals).toBe('100000');
      expect(abbreviated).toBe('100K');
    });
    test('should return for big number', () => {
      const { withDecimals, withoutDecimals, abbreviated } = abbreviateTokenBN('10000000000000000000', '18');
      expect(withDecimals).toBe('10000000000000000000');
      expect(withoutDecimals).toBe('10');
      expect(abbreviated).toBe('10');
    });
    test('should return for 0 number', () => {
      const { withDecimals, withoutDecimals, abbreviated } = abbreviateTokenBN('0', '18');
      expect(withDecimals).toBe('0');
      expect(withoutDecimals).toBe('0');
      expect(abbreviated).toBe('0');
    });
    test('should return for small number', () => {
      const { withDecimals, withoutDecimals, abbreviated } = abbreviateTokenBN('1', '18');
      expect(withDecimals).toBe('1');
      expect(withoutDecimals).toBe('0.000000000000000001');
      expect(abbreviated).toBe('few');
    });
  });
});
