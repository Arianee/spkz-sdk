import { Lifecycle, scoped } from 'tsyringe';
import { required, requiredDefined } from '../../../../helpers/required/required';
import { environment as environmentSettings, IEnvironment } from '../../../../environment/environment';

@scoped(Lifecycle.ContainerScoped)
export class EnvironmentService {
    public environment=environmentSettings.prod;

    constructor () {
      const { environment } = process.env;
      if (environment) {
        console.info('environment is set from process.env');
        this.environment = environmentSettings[environment];
      }
    }

    swithEnv (env:string):IEnvironment {
      requiredDefined(environmentSettings[env], `this env ${env} does not exist`);
      this.environment = environmentSettings[env];
      return this.environment;
    }

    setEnv (env:IEnvironment) {
      this.environment = env;
      return this.environment;
    }

    setProvider (provider:string) {
      this.environment.defaultProvider = provider;

      return this.environment;
    }
};

/**

 chain config pour les strategies

 env pour les rooms et bouncer

 **/
