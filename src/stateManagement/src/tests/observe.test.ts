import { filter, from, map } from 'rxjs';
import { getStore } from '../store';
import { filterOnChange, getPropertyMap, subscribeToProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { addNameToHelloWorld } from '../reducers/rooms/actions';
describe('utilies', () => {
  test('subscribeToProperty', (done) => {
    let numberOfCalls = 0;
    const state$ = from(subscribeToProperty('HelloWorld'));
    state$
      .subscribe(d => {
        numberOfCalls++;
        if (numberOfCalls === 3) {
          done();
        }
      });

    addNameToHelloWorld('efzefze');
    addNameToHelloWorld('efzefze');
    addNameToHelloWorld('efzefze');
  });
});
