import type BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseStocktakeAccumulated {
    accumulated: number;
    stocktake_id: string;
    uuid: string;
}

export interface BaseStocktakeAccumulatedRepository extends BaseRepository<
    LocalDatabaseStocktakeAccumulated
> {
    /**
     * Retrieve all accumulated stocktakes by stocktake ID
     */
    stocktake(stocktake: string): Promise<Array<LocalDatabaseStocktakeAccumulated>>;

    /**
     * Update an accumulated stocktake's data
     */
    update(uuid: string, changes: Partial<LocalDatabaseStocktakeAccumulated>): Promise<void>;
}
