import { type PaymentMethodTypeUnion } from "./BasePaymentMethodRepository.js";
import type BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseTakings {
    amount: number;
    type: PaymentMethodTypeUnion;
    uuid: string;
}

export interface BaseTakingsRepository extends BaseRepository<LocalDatabaseTakings> {
    /**
     * Retrieve all takings with the specified type
     */
    getByType(type: PaymentMethodTypeUnion): Promise<Array<LocalDatabaseTakings>>;
}
