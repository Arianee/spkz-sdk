import {singleton} from "tsyringe";
import {RepositoryService} from "./repositoryService";
import {PubSub} from "@google-cloud/pubsub";
import {TopicEnum} from "../models/topicEnum";
import axios from 'axios';

@singleton()
export class ReserveService {

    constructor(private repositoryService: RepositoryService) {

    }

    public getBDHToCheck = async () => {
        return this.repositoryService.getAllBDHReservedConfiguration();
    };

    public getNumberOfCertificateToReserve = async (pubKey: string) => {
        const [config, actual] = await Promise.all([
            this.repositoryService.getReservedConfiguration(pubKey),
            this.checkBDHReserved(pubKey)
        ]);

        if (config.number > actual) {
            return config.number - actual;
        } else {
            return 0;
        }
    };

    pubReserve1Certificate = async (publicKey: string) => {
        const pubsub = new PubSub();
        const topic = pubsub.topic(TopicEnum.reserve10Certificates);
        const [d] = await topic.exists();
        if (!d) {
            await pubsub.createTopic(TopicEnum.reserve10Certificates)
        }
        await topic.publish(Buffer.from(JSON.stringify({
            publicKey,
            type: 'reserveCertificate'
        })));
    };

    public triggerReservation = async (publicKey: string, num: number) => {
        if (num > 0) {
            num = num > 200 ? 200 : num;
            console.info(`trigger ${num} reserving certificate for`, publicKey);
            for (var i = 0; i < num; i++) {
                this.pubReserve1Certificate(publicKey)
            }
        } else {
            console.info("not reserving certificate for", publicKey);
        }
    };

    private checkBDHReserved = async (pubKey: string): Promise<number> => {
        const {apiKey, endpoint} = await this.repositoryService.getConfig(pubKey);
        const urlReserved = `${endpoint}/certificate/reserved/count`;

        try {

            const count = await axios(urlReserved, {
                method: 'get',
                headers: {
                    'Authorization': `Basic ${apiKey}`,
                    'content-type': 'application/json'
                }
            });

            return count.data.count;
        } catch (e) {
            console.error('error in checkBDHReserved');
            console.error(e);
        }

        return 0;
    }

}
