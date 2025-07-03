import { FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { BaseEmitableEvent } from "./BaseEmitableEvent.js";

export class TableUpdate extends BaseEmitableEvent<{
    location: string;
    data: Exclude<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"], null>;
}> {
    constructor(location: string, columns: Exclude<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"], null>) {
        super(ToShopfront.TABLE_UPDATE, {
            location,
            data: columns,
        });
    }
}
