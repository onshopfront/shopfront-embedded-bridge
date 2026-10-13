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
     * @inheritDoc
     */
    public async emit(
        data: FulfilmentFilterPipelineData
    ): Promise<FromShopfrontResponse["FULFILMENT_FILTER_PIPELINE"]> {
        const result: unknown = await this.callback(data.data, data.context);

        if(!Array.isArray(result) || !result.every(status => FILTER_STATUSES.includes(status))) {
            throw new TypeError("Callback must return an array of fulfilment order statuses");
        }

        return result;
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
