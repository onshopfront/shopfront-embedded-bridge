import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseStocktake {
    display_expected: boolean;
    name: string;
    outlet_id: string;
    uuid: string;
}

export type BaseStocktakeRepository = BaseRepository<LocalDatabaseStocktake>;
