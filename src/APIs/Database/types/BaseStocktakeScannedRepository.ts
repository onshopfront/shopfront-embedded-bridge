import type BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseStocktakeScanned {
    id?: number;
    accumulated: number;
    linked_to: null | number;
    product_id: string;
    quantity: number;
    removed: boolean;
    stocktake_id: string;
    timestamp: string;
    user_id: null | string;
    barcode: string | undefined;
    client_id: string;
}

export interface BaseStocktakeScannedRepository extends BaseRepository<
    LocalDatabaseStocktakeScanned,
    number
> {
    /**
     * Retrieve all scanned stocktakes by stocktake ID
     */
    stocktake(stocktake: string): Promise<Array<LocalDatabaseStocktakeScanned>>;

    /**
     * Update a scanned stocktake's data
     */
    update(id: number, changes: Partial<LocalDatabaseStocktakeScanned>): Promise<void>;
}
