import { ToShopfront } from "../ApplicationEvents/ToShopfront.js";
import { BaseEmitableEvent } from "./BaseEmitableEvent.js";

export interface PromotionApplicableData {
    enable: boolean;
    key: string;
}

export class SellScreenPromotionApplicable extends BaseEmitableEvent<PromotionApplicableData> {
    /**
     * Enable or disable a set of already created "applicable" promotions
     * @param key {string} The key to enable or disable, this supports wildcards using an asterisk
     * @param enable {boolean} Whether the key should be enabled or disabled
     */
    constructor(key: string, enable: boolean) {
        super(ToShopfront.SELL_SCREEN_PROMOTION_APPLICABLE, {
            key,
            enable,
        });
    }
}
