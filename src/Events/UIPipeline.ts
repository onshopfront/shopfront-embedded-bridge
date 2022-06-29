import { BaseEvent } from "./BaseEvent";
import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    ToShopfront, UIPipelineContext, UIPipelineResponse
} from "../ApplicationEvents";
import { Bridge } from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export class UIPipeline extends BaseEvent<
    { data: Array<UIPipelineResponse>, context: UIPipelineContext },
    MaybePromise<FromShopfrontReturns["UI_PIPELINE"]>,
    FromShopfrontReturns["UI_PIPELINE"],
    Array<UIPipelineResponse>,
    UIPipelineContext
> {
    constructor(callback: FromShopfrontCallbacks["UI_PIPELINE"]) {
        super(callback);
    }

    public async emit(
        data: { data: Array<UIPipelineResponse>, context: UIPipelineContext }
    ): Promise<FromShopfrontReturns["UI_PIPELINE"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(
        bridge: Bridge,
        data: FromShopfrontReturns["UI_PIPELINE"],
        id: string
    ) {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
