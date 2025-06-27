import { PaymentMethodTypeUnion } from "./BasePaymentMethodRepository.js";
import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseTakings {
    amount: number;
    type: PaymentMethodTypeUnion;
    uuid: string;
}

interface BaseTakingsRepository extends BaseRepository<LocalDatabaseTakings> {
    /**
     * Retrieve all takings with the specified type
     * @param type
     */
    getByType(type: PaymentMethodTypeUnion): Promise<Array<LocalDatabaseTakings>>;
}

export default BaseTakingsRepository;
