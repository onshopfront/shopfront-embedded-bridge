import { BaseEmitableEvent } from "../BaseEmitableEvent";
import { ToShopfront } from "../../ApplicationEvents";

export interface FulfilmentOptions {
    requireApproval: boolean;
}

export class Options extends BaseEmitableEvent<FulfilmentOptions> {
    constructor(options: FulfilmentOptions) {
        super(ToShopfront.FULFILMENT_OPTIONS, options);
    }
}
