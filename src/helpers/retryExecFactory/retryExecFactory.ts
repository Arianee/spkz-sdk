import promiseRetry from 'promise-retry';
export const retryExecFactory = async (func):Promise<any> => {
  return promiseRetry((retry, number) => {
    return func()
      .catch(retry);
  }, { retries: 3 });
};
