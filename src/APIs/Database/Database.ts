import {FromShopfront, FromShopfrontInternal, ToShopfront} from "../../ApplicationEvents";
import {Bridge} from "../../Bridge";

export class Database {
    protected bridge: Bridge;

    public constructor(bridge: Bridge) {
        this.bridge = bridge;
    }

    public callMethod<ExpectedResult>(table: string, method: string, args: Array<unknown>): Promise<ExpectedResult> {
        const databaseRequest = `DatabaseRequest-${Math.random()}-${Date.now()}`;

        const promise: Promise<ExpectedResult> = new Promise((res, rej) => {
            const listener = (event: keyof FromShopfrontInternal | keyof FromShopfront, data: Record<string, unknown>) => {
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

    public all<Item>(table: string): Promise<Array<Item>> {
        return this.callMethod<Array<Item>>(table, "all", []);
    }

    public get<Item>(table: string, id: string | number): Promise<Item> {
        return this.callMethod<Item>(table, "get", [id]);
    }

    public count(table: string): Promise<number> {
        return this.callMethod<number>(table, "count", []);
    }
}
