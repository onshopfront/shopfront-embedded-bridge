import { type FromShopfront, type FromShopfrontInternal, ToShopfront } from "../../ApplicationEvents.js";
import type { Bridge } from "../../Bridge.js";
import {
    BaseDatabase,
    type DatabaseCallReturn,
    type DatabaseMethodName,
    type DatabaseTable,
} from "./BaseDatabase.js";

export class Database extends BaseDatabase<Bridge> {

    constructor(bridge: Bridge) {
        super(bridge);
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
