import {singleton} from "tsyringe";
import {FirebaseService} from "./firebaseService";
import {BhdConfig} from "../models/bhdConfig";
import {CreditConfig} from "../models/creditConfig";


@singleton()
export class RepositoryService {


    constructor(private firebaseService: FirebaseService) {
    }

    /**
     * Get config from BDH
     * @param {string} publicKey
     * @returns {Promise<BhdConfig>}
     */
    public getConfig = async (publicKey: string): Promise<BhdConfig> => {
        return this.getFirebaseDoc<BhdConfig>('configurations', publicKey);
    };

    /**
     * Get configuration of reserved
     * @param {string} publicKey
     * @returns {Promise<CreditConfig>}
     */
    public getReservedConfiguration = (publicKey: string): Promise<CreditConfig> => {
        return this.getFirebaseDoc<CreditConfig>('reserved', publicKey);
    };

    /**
     * Get configuration of reserved
     * @param {string} publicKey
     * @returns {Promise<CreditConfig>}
     */
    public getAllBDHReservedConfiguration = async (): Promise<string[]> => {
        const all = await this.firebaseService.firebase.firestore().collection('reserved').get();

        return all.docs.map(d => d.id)

    };

    private getFirebaseDoc = async <T = any>(collection: string, docId: string): Promise<T> => {
        const d = await this.firebaseService.firebase
            .firestore()
            .collection(collection)
            .doc(docId)
            .get();

        if (d.exists) {
            return d.data() as T;
        } else {
            throw new Error(`No config for ${collection}/${docId}`)
        }
    }


}
