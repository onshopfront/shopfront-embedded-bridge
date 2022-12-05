export type OrderStatus = "PENDING_APPROVAL" | "WAITING_FOR_PACKING" | "PACKED" | "COLLECTED" | "COMPLETED";

export interface OrderSummaryDetails {
    id: string;
    customer: {
        name: string;
        phone: string;
    };
    courier?: {
        icon?: string;
        name: string;
        phone: string;
    };
    comment?: string;
    totalPrice: number;
    expiry?: string | Date;
    status: OrderStatus;
    finalLabel?: string;
    createdAt: string;
}

export type OrderCreateDetails = Omit<OrderSummaryDetails, "status"> & Partial<Pick<OrderSummaryDetails, "status">>;

export interface OrderDetails extends OrderSummaryDetails {
    items: Array<OrderItem>;
}

export interface OrderItem {
    id: string;
    image?: string;
    name: string;
    quantity: number;
    packSize: number;
    price: number;
    comment?: string;
    match?: OrderItemMatch;
}

export interface OrderItemMatch {
    id?: string;
    barcodes?: Array<string>;
    mdbId?: number;
    supplier?: {
        id?: string;
        mdbId?: number;
    };
    supplierCodes?: Array<string>;
}
