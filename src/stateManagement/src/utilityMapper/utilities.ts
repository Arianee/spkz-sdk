import { cloneDeep, get } from 'lodash';
import { getStore } from '../store';
import { Observable } from 'rxjs';

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
      const isStateNewOrEmpty = lastProperty !== getProperty(property) || (lastProperty?.length === 0 && getProperty(property)?.length === 0);
      if (isStateNewOrEmpty) {
        lastProperty = getProperty(property);
        next(lastProperty);
      }
    });
  });
}

export const filterOnChange = (property: string | string[]) => {
  let oldValue;
  return (newValue) => {
    return get(oldValue, property) !== get(newValue, property);
  };
};
