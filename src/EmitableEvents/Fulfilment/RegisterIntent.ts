import { ToShopfront } from "../../ApplicationEvents.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";
import { type FulfilmentOptions } from "./Options.js";

/**
 * Registers intent from the application to use the Fulfilment API
 * this event is not required but recommended to show the Fulfilment UI in shopfront sooner
 */
export class RegisterIntent extends BaseEmitableEvent<{
    options?: FulfilmentOptions;
}> {
    constructor(options: FulfilmentOptions) {
        super(ToShopfront.FULFILMENT_OPT_IN, {
            options,
        });
    }
}
