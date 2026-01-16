import type BaseRepository from "./BaseRepository.js";

export interface KitchenOrderItemComponent {
    id: string;
    name: string;
    quantity: number;
    components: Array<KitchenOrderItemComponent>;
}

export interface KitchenOrderItem {
    id: string; // This is a unique ID for the item on the order
    product: string; // The general ID of the item
    ready: boolean;
    category: string;
    tags: Array<string>;
    name: string;
    quantity: number;
    note: string;
    components: Array<KitchenOrderItemComponent>;
}

export interface KitchenOrder {
    id: string; // This is a unique ID for the order, not necessarily the sale ID
    register: string;
    outlet: string;
    invoiceId: string;
    note: string;
    internalNote: string;
    saleTime: string;
    customerName: null | string;
    items: Array<KitchenOrderItem>;
}

export interface LocalKitchenOrder {
    version: number;
    id: string;
    order: KitchenOrder;
}

export interface BaseKitchenOrderRepository extends BaseRepository<LocalKitchenOrder> {
    /**
     * Delete any orders below the specified version
     */
    removeVersionsBefore(version: number): Promise<void>;
}
