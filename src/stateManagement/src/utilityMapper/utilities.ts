import { cloneDeep, get, isEqual } from 'lodash';
import { getStore } from '../store';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export const getProperty = (property: string | string[]) => {
  return get(getStore().getState(), property);
};

export const getPropertyMap = (property: string | string[]) => () => {
  return get(getStore().getState(), property);
};

export function subscribeToProperty (property: string | string[] = ''):Observable<any> {
  return Observable.create(observer => {
    const next = (value) => {
      observer.next(cloneDeep(value));
    };
    let lastProperty;
    if (getProperty(property)) {
      next(getProperty(property));
    }

    return getStore().subscribe(() => {
      const value = getProperty(property);
      const isState = value !== undefined && value !== null;
      const isNotEqual = !isEqual(lastProperty, value);

      if (isState && isNotEqual) {
        lastProperty = cloneDeep(value);
        next(lastProperty);
      }
    });
  }).pipe(distinctUntilChanged(isEqual));
}

export const filterOnChange = (property: string | string[]) => {
  let oldValue;
  return (newValue) => {
    return get(oldValue, property) !== get(newValue, property);
  };
};
