export type ShopfrontSalePaymentStatus = "completed" | "cancelled" | "failed";
export type ShopfrontSaleProductType = "Normal" | "Basket" | "Package" | "Component" | "Voucher";

export interface ShopfrontSaleProduct {
    uuid: string,
    type: ShopfrontSaleProductType,
    name: string,
    quantity: number,
    prices: {
        price: number,
        normal: number,
    },
    tax: null | {
        id: string,
        amount: number,
    },
    note: string,
    products: Array<ShopfrontSaleProduct>,
    edited: boolean,
    caseQuantity: number,
    metaData: Record<string, unknown>,
    mapped?: string,
}

interface ShopfrontSaleCustomer {
    uuid: string,
}

export interface ShopfrontSalePayment {
    method: string,
    type: string,
    status: ShopfrontSalePaymentStatus,
    amount: number,
    cashout: number,
    rounding: number,
    metadata?: string;
}

export interface ShopfrontSaleState {
    clientId?: string,
    register?: string,
    products: Array<ShopfrontSaleProduct>,
    customer: false | ShopfrontSaleCustomer,
    payments: Array<ShopfrontSalePayment>,
    notes: {
        internal: string,
        sale: string,
    },
    totals: {
        sale: number,
        paid: number,
        savings: number,
        discount: number,
    },
    linkedTo: string,
    orderReference: string,
    refundReason: string,
    priceSet: string | null,
    metaData: Record<string, unknown>,
}
