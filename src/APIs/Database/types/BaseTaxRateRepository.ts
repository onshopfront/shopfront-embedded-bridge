import type BaseRepository from "./BaseRepository.js";
import { type BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseTaxRate {
    amount: number;
    mdb_id: null | number;
    name: string;
    uuid: string;
}

export type BaseTaxRateRepository = BaseRepository<LocalDatabaseTaxRate> &
    BaseSearchableRepository<LocalDatabaseTaxRate>;
