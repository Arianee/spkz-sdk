import {container} from "tsyringe";
import {FirebaseService} from "./firebaseService";
import {ProjectConfigService} from "./projectConfigService";
import {RepositoryService} from "./repositoryService";
import {ReserveService} from "./reserveService";
import {ArianeeService} from "./arianeeService";

export interface ServiceResolver {
    FirebaseService: FirebaseService,
    ProjectConfigService: ProjectConfigService,
    RepositoryService: RepositoryService,
    ReserveService: ReserveService,
    ArianeeService:ArianeeService
}

export const Services: ServiceResolver = {} as any;


[
    FirebaseService,
    ProjectConfigService,
    RepositoryService,
    ReserveService,
    ArianeeService
].forEach((className: any) => {
    container.registerSingleton(className);
    // @ts-ignore
    Services[className.name] = container.resolve(className);
});



