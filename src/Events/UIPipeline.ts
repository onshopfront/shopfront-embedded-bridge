import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    ToShopfront,
    type UIPipelineBaseContext,
    type UIPipelineContext,
    type UIPipelineResponse,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseBridge } from "../BaseBridge.js";
import { Bridge } from "../Bridge.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface UIPPipelineIncomingData {
    data: UIPipelineResponse;
    context: UIPipelineBaseContext;
    pipelineId?: string;
}

export class UIPipeline extends BaseEvent<
    UIPPipelineIncomingData,
    MaybePromise<FromShopfrontResponse["UI_PIPELINE"]>,
    FromShopfrontResponse["UI_PIPELINE"],
    UIPipelineResponse,
    UIPipelineContext
> {
    constructor(callback: FromShopfrontCallbacks["UI_PIPELINE"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(
        data: UIPPipelineIncomingData,
        bridge: Bridge
    ): Promise<FromShopfrontResponse["UI_PIPELINE"]> {
        const context: UIPipelineContext = {
            ...data.context,
        };

        if(typeof data.pipelineId === "string") {
            context.trigger = () => {
                bridge.sendMessage(ToShopfront.PIPELINE_TRIGGER, {
                    id: data.pipelineId,
                });
            };
        }

        const result = await this.callback(data.data, context);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: BaseBridge,
        data: FromShopfrontResponse["UI_PIPELINE"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
