import BaseRepository from "./BaseRepository.js";

export type ReceiptTypeUnion = "receipt-text" | "receipt-full" | "a4" | "email";

export interface ReceiptPaddingType {
    top: number | null;
    left: number | null;
    right: number | null;
    bottom: number | null;
}

export interface LocalDatabaseReceipt {
    accountReceipt: boolean;
    components: string;
    name: string;
    receiptWidth: number;
    type: ReceiptTypeUnion;
    uuid: string;
    padding: null | ReceiptPaddingType;
    attachments: null | Array<{
        receipt: string;
        name: string;
    }>;
}

export interface BaseReceiptRepository extends BaseRepository<LocalDatabaseReceipt> {
    /**
     * Retrieve all receipts that pass the specified filter
     */
    filter(filter: (item: LocalDatabaseReceipt) => boolean): Promise<Array<LocalDatabaseReceipt>>;

    /**
     * Retrieve all receipts with the specified type
     */
    getByType(type: ReceiptTypeUnion): Promise<Array<LocalDatabaseReceipt>>;
}
