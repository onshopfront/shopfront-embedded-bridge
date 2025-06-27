import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseStocktakeAccumulated {
    accumulated: number;
    stocktake_id: string;
    uuid: string;
}

interface BaseStocktakeAccumulatedRepository extends BaseRepository<
    LocalDatabaseStocktakeAccumulated
> {
    /**
     * Retrieve all accumulated stocktakes by stocktake ID
     * @param stocktake
     */
    stocktake(stocktake: string): Promise<Array<LocalDatabaseStocktakeAccumulated>>;

    /**
     * Update an accumulated stocktake's data
     * @param uuid
     * @param changes
     */
    update(uuid: string, changes: Partial<LocalDatabaseStocktakeAccumulated>): Promise<void>;
}

export default BaseStocktakeAccumulatedRepository;
