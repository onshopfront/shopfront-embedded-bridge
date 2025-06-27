import BaseRepository from "./BaseRepository.js";

export interface LocalDatabasePriceSet {
    name: string;
    uuid: string;
}

type BasePriceSetRepository = BaseRepository<LocalDatabasePriceSet>;

export default BasePriceSetRepository;
