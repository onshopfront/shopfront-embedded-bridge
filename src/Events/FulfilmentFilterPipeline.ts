import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    type FulfilmentFilterPipelineContext,
    type FulfilmentFilterPipelineEvent,
    type FulfilmentFilterStatus,
    ToShopfront,
} from "../ApplicationEvents/ToShopfront.js";
import type { BaseBridge } from "../BaseBridge.js";
import type { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface FulfilmentFilterPipelineData {
    data: FulfilmentFilterPipelineEvent;
    context: FulfilmentFilterPipelineContext;
}

const FILTER_STATUSES: ReadonlyArray<FulfilmentFilterStatus> = [
    "WAITING_FOR_PACKING",
    "PACKED",
    "COLLECTED",
    "COMPLETED",
];

export class FulfilmentFilterPipeline extends BaseEvent<
    FulfilmentFilterPipelineData,
    MaybePromise<FromShopfrontResponse["FULFILMENT_FILTER_PIPELINE"]>,
    FromShopfrontResponse["FULFILMENT_FILTER_PIPELINE"],
    FulfilmentFilterPipelineEvent,
    FulfilmentFilterPipelineContext
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_FILTER_PIPELINE"]) {
        super(callback);
    }

    /**
     * Invokes the callback, passing the statuses through unchanged if it fails or returns an invalid filter,
     * so Shopfront isn't left waiting for a response
     */
    public async emit(
        data: FulfilmentFilterPipelineData
    ): Promise<FromShopfrontResponse["FULFILMENT_FILTER_PIPELINE"]> {
        const statuses = [ ...data.data ];

        try {
            const result: unknown = await this.callback(data.data, data.context);

            if(
                !Array.isArray(result) ||
                result.length === 0 ||
                !result.every(status => FILTER_STATUSES.includes(status))
            ) {
                throw new TypeError("Callback must return a non-empty array of fulfilment order statuses");
            }

            return result;
        } catch(e) {
            console.error("Unable to change the fulfilment filter, the statuses have been passed through", e);

            return statuses;
        }
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: BaseBridge,
        data: FromShopfrontResponse["FULFILMENT_FILTER_PIPELINE"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
