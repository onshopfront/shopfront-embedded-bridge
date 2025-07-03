import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseTaxRate {
    amount: number;
    mdb_id: null | number;
    name: string;
    uuid: string;
}

export type BaseTaxRateRepository = BaseRepository<LocalDatabaseTaxRate> &
    BaseSearchableRepository<LocalDatabaseTaxRate>;
