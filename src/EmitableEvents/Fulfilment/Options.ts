import { ToShopfront } from "../../ApplicationEvents/ToShopfront.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";

export interface FulfilmentOptions {
    requireApproval: boolean;
}

export class Options extends BaseEmitableEvent<FulfilmentOptions> {
    constructor(options: FulfilmentOptions) {
        super(ToShopfront.FULFILMENT_OPTIONS, options);
    }
}
