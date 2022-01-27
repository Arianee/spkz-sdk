import promiseRetry from 'promise-retry';

export const retryExecFactory = async (func, retries = 3):Promise<any> => {
  return promiseRetry((retry, number) => {
    return func()
      .catch(retry);
  }, { retries });
};
