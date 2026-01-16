import type { ShopfrontSaleState } from "../APIs/Sale/index.js";
import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    type SalePreFinishPipelineContext,
    ToShopfront,
} from "../ApplicationEvents/ToShopfront.js";
import type { BaseBridge } from "../BaseBridge.js";
import type { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface SalePreFinishPipelineData {
    data: ShopfrontSaleState | false;
    context: SalePreFinishPipelineContext;
}

export class SalePreFinishPipeline extends BaseEvent<
    SalePreFinishPipelineData,
    MaybePromise<FromShopfrontResponse["SALE_PRE_FINISH_PIPELINE"]>,
    FromShopfrontResponse["SALE_PRE_FINISH_PIPELINE"],
    ShopfrontSaleState | false,
    SalePreFinishPipelineContext
> {
    constructor(callback: FromShopfrontCallbacks["SALE_PRE_FINISH_PIPELINE"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: SalePreFinishPipelineData): Promise<FromShopfrontResponse["SALE_PRE_FINISH_PIPELINE"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object" && result) {
            throw new TypeError("Callback must return an object or false");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: BaseBridge,
        data: FromShopfrontResponse["SALE_PRE_FINISH_PIPELINE"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
