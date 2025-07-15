type SaleProductType =
    "Normal" |
    "Product" |
    "GiftCard" |
    "Voucher" |
    "Basket" |
    "Package" |
    "Component" |
    "Integrated" |
    "Surcharge";

interface SaleGiftCard {
    code: string;
    amount: number;
    expiry: string;
    source: string;
}

interface SaleActiveSurcharge {
    id: number;
    amount: number;
}

export interface SaleEventProduct {
    uuid: string;
    type: SaleProductType;
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
        discountRate?: number; // The rate to be used for a discount
    };
    tax: {
        id: false | string;
        amount: number;
    };
    surcharge: null | SaleActiveSurcharge;
    products: Array<SaleEventProduct>;
    defaultProducts: Array<SaleEventProduct>;
    preventManualDiscount: boolean;
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
    giftCard: SaleGiftCard | null;
    note: string;
    userId: null | string;
    priceSet?: string;
    deleted?: boolean;
    initiallyDeleted?: boolean;
    familyId: string | null;
    categoryId: string | null;
    tags: Array<string>;
    canUnlock: boolean;
    discountReason?: string;
    requestPrice?: boolean;
    lockQuantity: boolean;
    metaData: Record<string, unknown>;
    barcodeQuantity?: number;
    lineId: string; // Unique ID for this line, only used internally to track state
    priceList: boolean;
}
