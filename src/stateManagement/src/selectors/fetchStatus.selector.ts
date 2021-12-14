import { getProperty } from '../utilityMapper/utilities';
import { REDUCERNAME } from '../reducerName';
import { Scope } from '@arianee/required';
import { defautlSubState, Substate } from '../reducers/fetchStatus/reducer';
export { FetchStatusEnum } from '../reducers/fetchStatus/FetchStatusEnum';
const scope = Scope({ scopes: ['fetchStatus', 'selector'] });

export const getFetchStatus = (parameters: { name:string }): Substate => {
  const {
    name
  } = parameters;

  const { requiredDefined } = scope.subScope('getUserProfileFromRoom');
  requiredDefined(name, 'name is required');

  const propertiesKey = `${REDUCERNAME.FETCHSTATUS}.${name}`;
  const propertyValue = getProperty(propertiesKey); ;
  if (propertyValue) {
    return propertyValue;
  } else {
    return defautlSubState();
  }
};
