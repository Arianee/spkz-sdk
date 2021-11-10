import { get } from 'lodash';
import { getStore } from '../store';
import { Observable } from 'rxjs';

export const getProperty = (property: string | string[]) => {
  return get(getStore().getState(), property);
};

export const getPropertyMap = (property: string | string[]) => () => {
  return get(getStore().getState(), property);
};

export function subscribeToProperty (property: string | string[] = ''):Observable<any> {
  let lastProperty;

  // Skip first one to avoid to get 'initial state'
  let internalUnsubscribe;
  return {
    unsubscribe: internalUnsubscribe,
    subscribe: (next) => {
      const internalUnsubscribe = getStore().subscribe(() => {
        if (lastProperty !== getProperty(property)) {
          lastProperty = getProperty(property);
          next(lastProperty);
        }
      });
      return { unsubscribe: internalUnsubscribe };
    },
    '@@observable': () => ({
      subscribe: (observer) => {
        const unsubscribe = getStore().subscribe(() => {
          if (lastProperty !== getProperty(property)) {
            lastProperty = getProperty(property);
            return observer.next(lastProperty);
          }
        });
        observer.next(lastProperty);
        return {
          unsubscribe
        };
      }
    })
  };
}

export const filterOnChange = (property: string | string[]) => {
  let oldValue;
  return (newValue) => {
    return get(oldValue, property) !== get(newValue, property);
  };
};
