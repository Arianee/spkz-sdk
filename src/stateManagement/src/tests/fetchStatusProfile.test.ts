import { getStore } from '../store';
import { getFetchStatus } from '../selectors/fetchStatus.selector';
import { updateFetchStatus } from '../reducers/FetchStatus/actions';

describe('UsersProfile', () => {
  beforeEach(() => {
    getStore(true);
  });

  describe('add user profile', () => {
    test('it should be false in initial value', () => {
      const { ws, initialHttpCall } = getFetchStatus({ name: 'myFetch' });
      expect(ws).toBeFalsy();
      expect(initialHttpCall).toBeFalsy();
    });
    test('it should be update one or the other', () => {
      const name = 'myFetch';
      updateFetchStatus({
        status: {
          ws: true
        },
        name
      });

      const { ws, initialHttpCall } = getFetchStatus({ name });
      expect(ws).toBeTruthy();
      expect(initialHttpCall).toBeFalsy();

      updateFetchStatus({
        status: {
          ws: false
        },
        name
      });

      const result = getFetchStatus({ name });
      expect(result.ws).toBeFalsy();
      expect(result.initialHttpCall).toBeFalsy();

      updateFetchStatus({
        status: {
          initialHttpCall: true,
          ws: true
        },
        name
      });

      const result2 = getFetchStatus({ name });
      expect(result2.ws).toBeTruthy();
      expect(result2.initialHttpCall).toBeTruthy();
    });
  });
});
