import BaseRepository from "./BaseRepository.js";

export interface LocalDatabasePriceSet {
    name: string;
    uuid: string;
}

export type BasePriceSetRepository = BaseRepository<LocalDatabasePriceSet>;
