import { from } from 'rxjs';
import { subscribeToProperty } from '../utilityMapper/utilities';
import { addNameToHelloWorld } from '../reducers/helloWorld/actions';

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
