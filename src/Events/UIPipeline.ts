import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    ToShopfront,
    UIPipelineBaseContext,
    UIPipelineContext,
    UIPipelineResponse,
} from "../ApplicationEvents.js";
import { BaseBridge } from "../BaseBridge.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface UIPPipelineIncomingData {
    data: Array<UIPipelineResponse>;
    context: UIPipelineBaseContext;
    pipelineId?: string;
}

export class UIPipeline extends BaseEvent<
    UIPPipelineIncomingData,
    MaybePromise<FromShopfrontReturns["UI_PIPELINE"]>,
    FromShopfrontReturns["UI_PIPELINE"],
    Array<UIPipelineResponse>,
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
    ): Promise<FromShopfrontReturns["UI_PIPELINE"]> {
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
        data: FromShopfrontReturns["UI_PIPELINE"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
