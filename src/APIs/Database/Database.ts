import { AnyFunction } from "@onshopfront/core";
import { FromShopfront, FromShopfrontInternal, ToShopfront } from "../../ApplicationEvents.js";
import { Bridge } from "../../Bridge.js";
import { DataSourceTables } from "./types/DataSourceTables.js";

export type DatabaseTable = keyof DataSourceTables;

export type DatabaseMethodName<Table extends DatabaseTable> = {
    [K in keyof DataSourceTables[Table]]: DataSourceTables[Table][K] extends AnyFunction ?
        K :
        never
};

export type DatabaseCallReturn<
    Table extends DatabaseTable,
    Method extends keyof DatabaseMethodName<Table>,
> = ReturnType<Extract<DataSourceTables[Table][Method], AnyFunction>>;

export interface DatabaseInterface {
    /**
     * Makes a request to the Shopfront local database
     */
    callMethod<
        Table extends DatabaseTable,
        Method extends keyof DatabaseMethodName<Table>,
        ExpectedResult extends DatabaseCallReturn<Table, Method>
    >(
        table: Table,
        method: Method,
        args: Array<unknown>
    ): Promise<ExpectedResult>;

    /**
     * Retrieves all items in the specified table
     */
    all<Table extends DatabaseTable>(table: Table): Promise<DatabaseCallReturn<Table, "all">>;

    /**
     * Retrieves all items that match the given ID in the specified table
     */
    get<Table extends DatabaseTable>(
        table: Table,
        id: string | number
    ): Promise<DatabaseCallReturn<Table, "get">>;

    /**
     * Returns the item count of the specified table
     */
    count(table: DatabaseTable): Promise<number>;
}

export class Database implements DatabaseInterface {
    protected bridge: Bridge;

    constructor(bridge: Bridge) {
        this.bridge = bridge;
    }

    /**
     * @inheritDoc
     */
    public async callMethod<
        Table extends DatabaseTable,
        Method extends keyof DatabaseMethodName<Table>,
        ExpectedResult extends DatabaseCallReturn<Table, Method>
    >(
        table: Table,
        method: Method,
        args: Array<unknown>
    ): Promise<ExpectedResult> {
        const databaseRequest = `DatabaseRequest-${Math.random()}-${Date.now()}`;

        const promise = new Promise<ExpectedResult>((res, rej) => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(
                    event !== "RESPONSE_DATABASE_REQUEST"
                ) {
                    return;
                }

                if(data.requestId !== databaseRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);

                if(data.error) {
                    rej(data.error);

                    return;
                }

                res(data.results as ExpectedResult);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.DATABASE_REQUEST, {
            requestId: databaseRequest,
            table,
            method,
            args,
        });

        return promise;
    }

    /**
     * @inheritDoc
     */
    public async all<Table extends DatabaseTable>(table: Table): Promise<DatabaseCallReturn<Table, "all">> {
        return this.callMethod(table, "all", []);
    }

    /**
     * @inheritDoc
     */
    public async get<Table extends DatabaseTable>(
        table: Table,
        id: string | number
    ): Promise<DatabaseCallReturn<Table, "get">> {
        return this.callMethod(table, "get", [ id ]);
    }

    /**
     * @inheritDoc
     */
    public async count(table: DatabaseTable): Promise<number> {
        return this.callMethod(table, "count", []);
    }
}
