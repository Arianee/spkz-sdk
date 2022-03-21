import { Lifecycle, scoped } from 'tsyringe';
import { requiredDefined } from '../../../../helpers/required/required';
import { environment as environmentSettings, IEnvironment } from '../../../../environment/environment';
import { get } from 'lodash';
import { isBrowser, isNode } from '../../../../helpers/isNodeOrBrowser.helper';
import { SpkzConfiguration } from '../../../../models/spkzConfiguration';

@scoped(Lifecycle.ContainerScoped)
export class EnvironmentService {
    public environment:IEnvironment
    public spkzConfiguration?:SpkzConfiguration

    constructor () {
      this.setEnvFromProcessEnvOrWindow();
    }

    private setEnvFromProcessEnvOrWindow () {
      let environment;
      if (isBrowser) {
        environment = get(window, 'spkzEnv');
      } else if (isNode) {
        environment = get(process, 'env.spkzEnv');
      }

      if (environment) {
        requiredDefined(environmentSettings[environment], `this env ${environment} does not exist`);
        console.info(`environment is set from process.env to ${environment}`);
        this.environment = environmentSettings[environment];
      } else {
        this.environment = environmentSettings.prod;
      }
    }

    swithEnv = (env:string): IEnvironment => {
      requiredDefined(environmentSettings[env], `this env ${env} does not exist`);
      this.environment = environmentSettings[env];
      return this.environment;
    };

    setEnv = (env:IEnvironment) => {
      this.environment = env;
      return this.environment;
    };

    setProvider = (provider:string) => {
      this.environment.defaultProvider = provider;

      return this.environment;
    };
};

/**

 chain config pour les strategies

 env pour les rooms et bouncer

 **/
