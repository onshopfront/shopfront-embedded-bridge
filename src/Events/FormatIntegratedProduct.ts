import { BaseEvent } from "./BaseEvent";
import {
    FormatIntegratedProductEvent,
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    ToShopfront
} from "../ApplicationEvents";
import { Bridge } from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export type FormattedSaleProductType =
    "Normal" |
    "Product" |
    "GiftCard" |
    "Voucher" |
    "Basket" |
    "Package" |
    "Component" |
    "Integrated";

export interface SaleGiftCard {
    code: string;
    amount: number;
    expiry: string;
}

export interface FormattedSaleProduct {
    uuid: string;
    type: FormattedSaleProductType;
    name: string;
    caseQuantity: number;
    isCase: boolean;
    quantity: number;
    loyalty: {
        earn: number;
        redeem: number;
    };
    prices: {
        price: number; // Will always be the correct price
        unlockedPrice: number; // The price if the product was unlocked
        normal: number; // The normal everyday price
        base: number; // The single price * the quantity
        addPrice: number; // The additional price to add to the product cost (for components)
        removePrice: number; // The additional price to remove from the product (for components)
        additionalPrice: number; // The additional price that has been applied to the product (for packages)
    };
    tax: {
        id: false | string;
        amount: number;
    };
    products: Array<FormattedSaleProduct>;
    defaultProducts: Array<FormattedSaleProduct>;
    special: boolean;
    edited: boolean;
    promotions: {
        [id: string]: {
            name: string;
            active: boolean;
            quantity: number;
        };
    };
    rebates: {
        [id: string]: {
            amount: number;
            quantity: number;
        };
    };
    giftCard: SaleGiftCard | null;
    note: string;
    userId: null | string;
    priceSet?: string;
    deleted?: boolean;
    initiallyDeleted?: boolean;
    familyId: string | null;
    canUnlock: boolean;
    discountReason?: string;
    requestPrice?: boolean;
    lockQuantity: boolean;
    metaData: {
        [key: string]: unknown;
    };
}

export class FormatIntegratedProduct extends BaseEvent<
    FormatIntegratedProductEvent,
    MaybePromise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>,
    FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]
> {
    constructor(callback: FromShopfrontCallbacks["FORMAT_INTEGRATED_PRODUCT"]) {
        super(callback);
    }

    public async emit(
        data: { product: FormattedSaleProduct }
    ): Promise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]> {
        const result = await this.callback(data, undefined);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(
        bridge: Bridge,
        data: Array<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>,
        id: string
    ) {
        if(data.length > 1) {
            throw new Error("Multiple integrated product responses found, please ensure you are only subscribed to FORMAT_INTEGRATED_PRODUCT once");
        }

        bridge.sendMessage(ToShopfront.RESPONSE_FORMAT_PRODUCT, data[0], id);
    }
}
