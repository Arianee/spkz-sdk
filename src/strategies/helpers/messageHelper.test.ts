import { minMaxMessage, veryVerySmallAmout } from './messageHelper';

describe('message helper', () => {
  test('it should say a amount if big enough', () => {
    const b = minMaxMessage({
      decimals: 10,
      amountRequired: 100000000000000000,
      balance: 100,
      symbol: 'eth'
    });

    expect(b.includes('little bit')).toBeTruthy();
  });

  test('it should say a little bit', () => {
    const b = minMaxMessage({
      decimals: 10,
      amountRequired: 1,
      balance: 0,
      symbol: 'eth'
    });

    expect(b.includes('little bit')).toBeTruthy();
  });

  test('it should work for erc 721', () => {
    const b = minMaxMessage({
      decimals: 0,
      amountRequired: 1,
      balance: 0,
      symbol: 'sba'
    });

    expect(b.includes('little bit')).toBeFalsy();
  });
});
