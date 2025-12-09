import { type FromShopfrontResponse, ToShopfront } from "../ApplicationEvents/ToShopfront.js";
import { BaseEmitableEvent } from "./BaseEmitableEvent.js";

export class TableUpdate extends BaseEmitableEvent<{
    location: string;
    data: Exclude<FromShopfrontResponse["REQUEST_TABLE_COLUMNS"], null>;
}> {
    constructor(location: string, columns: Exclude<FromShopfrontResponse["REQUEST_TABLE_COLUMNS"], null>) {
        super(ToShopfront.TABLE_UPDATE, {
            location,
            data: columns,
        });
    }
}
