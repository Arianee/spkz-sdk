import {singleton} from "tsyringe";
import {Arianee, NETWORK} from "@arianee/arianeejs";


@singleton()
export class ArianeeService {

    private $arianee = new Arianee().init(NETWORK.testnet);

    constructor() {

    }

    //0x7053E66f317c51042614185083268C2eD84586E3
    public getWallet = async () => {
        const arianee = await this.$arianee;
        return arianee.fromMnemonic("recycle total wrong express laugh marble garlic vacuum element client street nerve");
    }
}
