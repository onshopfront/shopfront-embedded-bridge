import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

interface CompletedSaleProduct {
    uuid: string;
    type: "Normal" |
        "Product" |
        "GiftCard" |
        "Voucher" |
        "Basket" |
        "Package" |
        "Component" |
        "Integrated";
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
    products: Array<CompletedSaleProduct>;
    defaultProducts: Array<CompletedSaleProduct>;
    special: boolean;
    edited: boolean;
    promotions: Record<string, {
        name: string;
        active: boolean;
        quantity: number;
    }>;
    rebates: Record<string, {
        amount: number;
        quantity: number;
    }>;
    giftCard: {
        code: string;
        amount: number;
        expiry: string;
    } | null;
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
    metaData: Record<string, unknown>;
}

interface CompletedSalePayment {
    method: string;
    type: string;
    status: "approved" | "cancelled" | "declined" | "completed" | "failed";
    amount: number;
    cashout: number;
    rounding: number | undefined;
    metadata: string;
    registerId: string;
    userId?: string;
    processTime?: string;
    receipt?: string;
    reverted: boolean;
    uploaded?: boolean;
    voucherRefund?: boolean;
}

export interface CompletedSale {
    products: Array<CompletedSaleProduct>;
    customer: false | {
        uuid: string;
    };
    payments: Array<CompletedSalePayment>;
    notes: {
        internal: string;
        sale: string;
    };
    totals: {
        sale: number;
        remaining: number;
        paid: number;
        savings: number;
        discount: number;
        change: number;
        cashout: number;
        rounding: number;
    };
    registerId: string;
    userId: string;
    orderReference: string;
    refundReason: string;
    status: "COMPLETED" | "CANCELLED";
    id: string;
    invoiceId: string;
    createdAt: string;
    metaData: Record<string, unknown>;
}

export class SaleComplete extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["SALE_COMPLETE"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: CompletedSale): Promise<FromShopfrontResponse["SALE_COMPLETE"]> {
        return this.callback(data, undefined);
    }
}
