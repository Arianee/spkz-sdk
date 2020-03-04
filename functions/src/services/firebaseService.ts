import {singleton} from "tsyringe";
import * as admin from 'firebase-admin';

var serviceAccount = require("../../firebase-credentials.json");


@singleton()
export class FirebaseService {

    public firebase=admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });


}
//recycle total wrong express laugh marble garlic vacuum element client street nerve
//0x7053E66f317c51042614185083268C2eD84586E3
