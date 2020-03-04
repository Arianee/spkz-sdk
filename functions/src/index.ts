process.env.GOOGLE_APPLICATION_CREDENTIALS = "./firebase-credentials.json";

import 'reflect-metadata';
import * as functions from 'firebase-functions';


import './cloudFunctions/reserveCertificates'
import {TopicEnum} from "./models/topicEnum";
import {checkReservedCertificates, reserveCertificateFor} from "./cloudFunctions/reserveCertificates";


exports.reserveCredit = functions
    .runWith({timeoutSeconds: 500, memory: '2GB'})
    .pubsub.schedule('0 0 0/1 ? * * *')
    .onRun(checkReservedCertificates);

exports.reserve1Certificates = functions.pubsub
    .topic(TopicEnum.reserve10Certificates)
    .onPublish((message) => reserveCertificateFor(message.json.publicKey));
