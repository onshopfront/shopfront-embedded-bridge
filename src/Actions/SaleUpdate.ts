import type { ShopfrontSalePaymentStatus } from "../APIs/Sale/index.js";
import type { SalePaymentOptions } from "../APIs/Sale/SalePayment.js";
import type { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";

export interface SaleUpdateChanges {
    PRODUCT_ADD: {
        id: string;
        quantity: number;
        price?: number;
        consolidate?: boolean;
        indexAddress?: Array<number>;
        metaData: Record<string, unknown>;
    };
    PRODUCT_REMOVE: {
        id: string;
        indexAddress: Array<number>;
    };
    PAYMENT_ADD: {
        id: string;
        amount: number;
        cashout?: number | boolean;
        status?: ShopfrontSalePaymentStatus;
        options?: SalePaymentOptions;
    };
    PAYMENT_REVERSE: {
        id: string;
        amount: number;
        cashout?: number;
        status?: ShopfrontSalePaymentStatus;
    };
    SALE_CANCEL: Record<string, never>;
    CUSTOMER_ADD: {
        id: string;
    };
    CUSTOMER_REMOVE: Record<string, never>;
    SALE_EXTERNAL_NOTE: {
        note: string;
        append?: boolean;
    };
    SALE_INTERNAL_NOTE: {
        note: string;
        append?: boolean;
    };
    SALE_ORDER_REFERENCE: {
        reference: string;
    };
    SALE_META_DATA: {
        metaData: Record<string, unknown>;
    };
    PRODUCT_UPDATE: {
        id: string;
        indexAddress: Array<number>;
        quantity?: number;
        price?: number;
        metaData?: Record<string, unknown>;
    };
}

export class SaleUpdate<K extends keyof SaleUpdateChanges> extends BaseAction<SaleUpdate<K>> {
    protected supportedEvents = [];

    protected type: K;
    protected data: SaleUpdateChanges[K];

    constructor(type: Serialized<SaleUpdate<K>> | K, data?: SaleUpdateChanges[K]) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof type === "string") {
                return {
                    properties: [ type, data ],
                    events    : {},
                    type      : "SaleUpdate",
                };
            } else {
                return type;
            }
        })(), SaleUpdate);

        if(typeof data === "undefined" && typeof type !== "string") {
            this.type = type.properties[0] as K;
            this.data = type.properties[1] as SaleUpdateChanges[K];
        } else {
            this.type = type as K;

            if(typeof data === "undefined") {
                throw new TypeError("Invalid sale update data specified");
            } else {
                this.data = data;
            }
        }
    }
}
