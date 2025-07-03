import BaseRepository from "./BaseRepository.js";

export type LoyaltyUnion = "brand" | "category" | "family" | "tag" | "product";

export interface LocalDatabaseLoyalty {
    id: number;
    loyalty_value: null | string;
    quantity: string;
    redeem_value: null | string;
    type: LoyaltyUnion;
    uuid: string; // The ID of the classification
}

export interface BaseLoyaltyRepository extends BaseRepository<LocalDatabaseLoyalty, number> {
    /**
     * Retrieve all loyalty rates with the specified ID and type
     */
    getByType(id: string, type: LoyaltyUnion): Promise<Array<LocalDatabaseLoyalty>>;
}
