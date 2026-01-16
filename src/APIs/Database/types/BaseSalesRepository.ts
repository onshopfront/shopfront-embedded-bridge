import type BaseRepository from "./BaseRepository.js";

export type SaleActionType =
    "PRODUCT_SCAN" |
    "PRODUCT_SEARCH_ADD" |
    "PRODUCT_KEY_ADD" |
    "QUANTITY_OVERRIDE" |
    "INCREMENT" |
    "DECREMENT" |
    "REMOVE_PRODUCT" |
    "CUSTOMER_SCAN" |
    "CUSTOMER_SEARCH_ADD" |
    "CUSTOMER_KEY_ADD" |
    "REMOVE_CUSTOMER" |
    "ADD_PAYMENT" |
    "REMOVE_PAYMENT";

export interface SaleAction {
    timestamp: string;
    action: SaleActionType;
    value: string;
    affecting: string;
    user: string;
}

export type LocalDatabaseSalePaymentStatus = "cancelled" | "completed" | "failed";

export type SaleStatus = "COMPLETED" | "CANCELLED" | "PARKED" | "INCOMPLETE" | "UNPARKED";

export interface LocalDatabaseSaleItemTypeProduct {
    id: string;
    type: "Product";
    name: string;
}

export interface LocalDatabaseSaleItemTypeGiftCard {
    type: "GiftCard";
    id: string;
    name: string;
    code: string;
    expiry: string;
    source: string;
}

export interface LocalDatabaseSaleItemTypeSurcharge {
    type: "Surcharge";
}

export type LocalDatabaseSaleItemType =
    LocalDatabaseSaleItemTypeProduct |
    LocalDatabaseSaleItemTypeGiftCard |
    LocalDatabaseSaleItemTypeSurcharge;

export interface LocalDatabaseSaleItemPromotion {
    promotion: string;
    rebateAmount: number;
    rebateQuantity: number;
    savings: number;
    quantity: number;
}

export interface LocalDatabaseSaleItem {
    basePrice: number;
    caseQuantity: number;
    cost?: number;
    discount: {
        amount: string;
        reason: string;
    };
    item: LocalDatabaseSaleItemType;
    loyaltyValue: number;
    note: string;
    products: Array<LocalDatabaseSaleItem>;
    promotions: Array<LocalDatabaseSaleItemPromotion>;
    quantity: number;
    savings: number;
    tax: number;
    taxRate: string | null;
    totalPrice: number;
    priceList: boolean;
    metaData: Record<string, unknown>;
}

export interface LocalDatabaseSalePayment {
    amount: number;
    metaData?: unknown;
    cashout: number;
    rounding: number;
    paymentMethodId: string;
    registerId: string;
    status: LocalDatabaseSalePaymentStatus;
    processTime: string;
    receipt: string | null;
    subtype: null | string;
}

export interface LocalDatabaseSale {
    cashout: number;
    clientId?: string;
    createdAt: string;
    customerId: null | string;
    discount: {
        amount: string;
        reason: string;
    };
    id: string;
    invoiceId: string;
    items: Array<LocalDatabaseSaleItem>;
    linkedTo: null | string;
    loyaltyValue: number;
    notes: {
        internal: string;
        sale: string;
    };
    orderReference: string;
    payments: Array<LocalDatabaseSalePayment>;
    refundReason: null | string;
    registerId: string;
    status: SaleStatus;
    totalBase: number;
    totalChange: number;
    totalCost: number;
    totalPrice: number;
    totalQuantity: number;
    totalRounding: number;
    totalTax: number;
    updatedAt: string;
    uploaded: boolean;
    userId: string;
    actions: Array<SaleAction>;
    metaData: Record<string, unknown>;
}

export interface BaseSalesRepository extends BaseRepository<LocalDatabaseSale> {
    /**
     * Retrieve all parked sales
     */
    parked(): Promise<Array<LocalDatabaseSale>>;

    /**
     * Retrieve all sales with the specified client ID
     */
    getByClientId(id: string): Promise<Array<LocalDatabaseSale>>;

    /**
     * Retrieve all sales with the specified invoice ID
     */
    search(invoiceId: string): Promise<Array<LocalDatabaseSale>>;

    /**
     * Retrieve all sales that pass the specified filter
     */
    filter(callback: (sale: LocalDatabaseSale) => boolean): Promise<Array<LocalDatabaseSale>>;
}
