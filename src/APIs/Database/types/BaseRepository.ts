export default interface BaseRepository<DataType extends object = object, IdType = string> {
    /**
     * Retrieve all items in the repository
     * @param orderBy
     */
    all(orderBy?: string): Promise<Array<DataType>>;

    /**
     * Retrieve an item by its UUID
     * @param uuid
     */
    get(uuid: IdType): Promise<DataType>;

    /**
     * Add an item to the repository
     * @param item
     */
    put(item: Array<DataType> | DataType): Promise<IdType>;

    /**
     * Update an item in the repository
     * @param uuid
     * @param changes
     */
    update(uuid: IdType, changes: Partial<DataType>): Promise<void>;

    /**
     * Return the number of items in the repository
     */
    count(): Promise<number>;

    /**
     * Delete all items from the repository
     */
    empty(): Promise<void>;

    /**
     * Delete multiple items from the repository
     * @param items
     */
    delete(items: IdType | Array<IdType>): Promise<void>;

    /**
     * Invoke a callback for each item in the repository
     * @param callback
     */
    each(callback: (item: DataType) => void): Promise<void>;
}
