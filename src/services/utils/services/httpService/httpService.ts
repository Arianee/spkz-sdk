import { Lifecycle, scoped } from 'tsyringe';
import axios from 'axios';

@scoped(Lifecycle.ContainerScoped)
export class HttpService {
  public static get defaultConfig () {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  /**
     * HTTP call
     * Default configuration of headers is method GET and content-type: application/json
     * @param url
     * @param config
     * @return Promise{any}
     */
  public async fetch (
    url: string,
    config: any = { ...HttpService.defaultConfig }
  ) {
    if (config.body) {
      config.data = config.body;
    }

    try {
      return this.httpFetch(url, config);
    } catch (e) {
      console.warn('Error on fetch', url, config);
      Promise.reject(e);
    }
  }

    private httpFetch=(url, config) => axios(url, config).then(result => result.data);
}
