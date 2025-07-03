import { BaseBridge } from "../../BaseBridge.js";
import { AnyFunction } from "../../Utilities/MiscTypes.js";
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

export abstract class BaseDatabase<BridgeType extends BaseBridge = BaseBridge> {
    protected bridge: BridgeType;

    protected constructor(bridge: BridgeType) {
        this.bridge = bridge;
    }

    /**
     * Makes a request to the Shopfront local database
     */
    public abstract callMethod<
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
    public abstract all<Table extends DatabaseTable>(table: Table): Promise<DatabaseCallReturn<Table, "all">>;

    /**
     * Retrieves all items that match the given ID in the specified table
     */
    public abstract get<Table extends DatabaseTable>(
        table: Table,
        id: string | number
    ): Promise<DatabaseCallReturn<Table, "get">>;

    /**
     * Returns the item count of the specified table
     */
    public abstract count(table: DatabaseTable): Promise<number>;
}
