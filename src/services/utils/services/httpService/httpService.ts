import { Lifecycle, scoped } from 'tsyringe';
import axios from 'axios';
import cache from 'memory-cache';
import { requiredDefined } from '../../../../helpers/required/required';

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

  public static get infuriaIPFSConfig () {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  tryGetConfigForURL = function (url: string, defaultConfig) {
    if (url.startsWith('https://ipfs.infura.io')) {
      return HttpService.infuriaIPFSConfig;
    }

    return defaultConfig || HttpService.defaultConfig;
  }

  public fetchWithCache (
    url: string,
    config: any = { ...HttpService.defaultConfig }
  ) {
    requiredDefined(url, 'url should be defined');

    const request = cache.get(url);
    if (!request) {
      const cacheTimeout = 30 * 1000;
      cache.put(url, this.fetch(url, config), cacheTimeout)
        .catch(e => {
          cache.del(url);
          return Promise.reject(e);
        });
    }

    return cache.get(url);
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
    const selectedConfig = this.tryGetConfigForURL(url, config);

    if (config.body) {
      selectedConfig.data = config.body;
    }

    try {
      return this.httpFetch(url, selectedConfig);
    } catch (e) {
      console.warn('Error on fetch', url, selectedConfig);
      return Promise.reject(e);
    }
  }

    private httpFetch=(url, config) => axios(url, config).then(result => result.data).catch(e => console.error(e.message, `url(${url})`));
}
