import type BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseGiftCard {
    client_id: string;
    code: string;
    current_amount: string;
    expiry: string;
    original_amount: string;
    outlet_id: string;
    status: "active" | "cancelled" | "pending";
    updated_at: string;
    uuid: string;
}

export interface BaseGiftCardRepository extends BaseRepository<LocalDatabaseGiftCard> {
    /**
     * Retrieve all gift cards with the specified code
     */
    code(code: string): Promise<Array<LocalDatabaseGiftCard>>;
}
