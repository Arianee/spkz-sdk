import { ActionTypes } from './actionTypes';
import * as _ from 'lodash';

describe('Action Enum', () => {
  test('action enum should be unique', () => {
    // Retrieve all action type name
    function propertiesToArray (obj) {
      const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

      const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

      const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
          .reduce((product, [key, value]) => {
            const fullPath = addDelimiter(head, key);
            return isObject(value)
              ? product.concat(paths(value, fullPath))
              : product.concat(fullPath);
          }, []);
      };
      return paths(obj).map(prop => _.get(obj, prop));
    }

    expect(propertiesToArray(ActionTypes))
      .toHaveLength(_.uniq(propertiesToArray(ActionTypes)).length);
  });
});
