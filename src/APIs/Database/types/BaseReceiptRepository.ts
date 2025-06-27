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

interface BaseReceiptRepository extends BaseRepository<LocalDatabaseReceipt> {
    /**
     * Retrieve all receipts that pass the specified filter
     * @param filter
     */
    filter(filter: (item: LocalDatabaseReceipt) => boolean): Promise<Array<LocalDatabaseReceipt>>;

    /**
     * Retrieve all receipts with the specified type
     * @param type
     */
    getByType(type: ReceiptTypeUnion): Promise<Array<LocalDatabaseReceipt>>;
}

export default BaseReceiptRepository;
