import * as validators from './validators';

describe('utilities', () => {
  describe('isUndefined', () => {
    it('should return true if value is undefined', () => {
      const value = undefined;
      expect(validators.isUndefined(value)).toBeTruthy();
    });
    it('should return false if value is defined', () => {
      const value = 'hello';
      expect(validators.isUndefined(value)).toBeFalsy();
    });
  });

  describe('isNull', () => {
    it('should return true if value is null', () => {
      const value = null;
      expect(validators.isNull(value)).toBeTruthy();
    });
    it('should return false if value is not null', () => {
      const value = 'hello';
      expect(validators.isNull(value)).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('should return true if value is a string', () => {
      const value = 'a string';
      expect(validators.isString(value)).toBeTruthy();
    });
    it('should return false if value is not a string', () => {
      const value = 7454;
      expect(validators.isString(value)).toBeFalsy();
    });
  });

  describe('isEthereumAddress', () => {
    it('should return true if value is an ETH address', () => {
      const value = '0x5d1e2e92488b9911c08a559ad9e3a8bd0f31b2f4';
      expect(validators.isEthereumAddress(value)).toBeTruthy();
    });
    it('should return false if value is not an ETH address', () => {
      const value = parseInt('451214', 16);
      expect(validators.isEthereumAddress(value)).toBeFalsy();
    });
  });

  describe('minLength', () => {
    it('should return true if value length is greater than or equal to min length', () => {
      const value = ['1', '2'];
      const minLength = 1;
      expect(validators.minLength(value, minLength)).toBeTruthy();
    });
    it('should return false if value length is smaller than min length', () => {
      const value = ['1', '2'];
      const minLength = 3;
      expect(validators.minLength(value, minLength)).toBeFalsy();
    });
  });

  describe('maxLength', () => {
    it('should return true if value length is lower than or equal to min length', () => {
      const value = ['1', '2'];
      const maxLength = 2;
      expect(validators.maxLength(value, maxLength)).toBeTruthy();
    });
    it('should return false if value length is greater than min length', () => {
      const value = ['1', '2'];
      const maxLength = 1;
      expect(validators.maxLength(value, maxLength)).toBeFalsy();
    });
  });

  describe('onlyNumericChars', () => {
    it('should return true if value contains only numeric chars', () => {
      const value = '454539452315462234625676173721324723723162637379387939234524625';
      expect(validators.onlyNumericChars(value)).toBeTruthy();
    });
    it('should return false if value contains other chars than numeric chars', () => {
      const value = 'AG4eg454G5ehh2e';
      expect(validators.onlyNumericChars(value)).toBeFalsy();
    });
  });

  describe('isURL', () => {
    it('should return true if value is an URL', () => {
      const value = 'https://google.com/';
      expect(validators.isURL(value)).toBeTruthy();
    });
    it('should return false if value is not an URL', () => {
      const value = 'gagagsgzahag';
      expect(validators.isURL(value)).toBeFalsy();
    });
  });

  describe('isArray', () => {
    it('should return true if value is an array', () => {
      const value = [null, 1, 'test'];
      expect(validators.isArray(value)).toBeTruthy();
    });
    it('should return false if value is not an array', () => {
      const value = 'test';
      expect(validators.isArray(value)).toBeFalsy();
    });
  });

  describe('isChainId', () => {
    it('should return true if value is a stringified chainId', () => {
      const value = '4';
      expect(validators.isChainId(value)).toBeTruthy();
    });
    it('should return false if value is not a stringified chainId', () => {
      const value = 4;
      expect(validators.isChainId(value)).toBeFalsy();
    });
  });

  describe('isNetworkId', () => {
    it('should return true if value is a stringified networkId', () => {
      const value = '4';
      expect(validators.isNetworkId(value)).toBeTruthy();
    });
    it('should return false if value is not a stringified networkId', () => {
      const value = 4;
      expect(validators.isNetworkId(value)).toBeFalsy();
    });
  });

  describe('isEventId', () => {
    it('should return true if value is a stringified isEventId', () => {
      const value = '4';
      expect(validators.isEventId(value)).toBeTruthy();
    });
    it('should return false if value is not a stringified isEventId', () => {
      const value = 4;
      expect(validators.isEventId(value)).toBeFalsy();
    });
  });

  describe('isTokenId', () => {
    it('should return true if value is a stringified isTokenId', () => {
      const value = '4';
      expect(validators.isTokenId(value)).toBeTruthy();
    });
    it('should return false if value is not a stringified isTokenId', () => {
      const value = 4;
      expect(validators.isTokenId(value)).toBeFalsy();
    });
  });

  describe('isMinBalance', () => {
    it('should return true if value is a stringified number greater than 0', () => {
      const value = '25155631';
      expect(validators.isMinBalance(value)).toBeTruthy();
    });
    it('should return false if value is not a stringified number greater than 0', () => {
      const value = '';
      expect(validators.isMinBalance(value)).toBeFalsy();
    });
    it('should return false if value is not a stringified number', () => {
      const value = 'ageagshezg';
      expect(validators.isMinBalance(value)).toBeFalsy();
    });
  });

  describe('isNotSet', () => {
    it('should return true if value is undefined', () => {
      const value = undefined;
      expect(validators.isNotSet(value)).toBeTruthy();
    });
    it('should return true if value is null', () => {
      const value = null;
      expect(validators.isNotSet(value)).toBeTruthy();
    });

    it('should return true if value is an empty string', () => {
      const value = '';
      expect(validators.isNotSet(value)).toBeTruthy();
    });

    it('should return false if value is set', () => {
      const value = 'agagagsvg';
      expect(validators.isNotSet(value)).toBeFalsy();
    });
  });
});
