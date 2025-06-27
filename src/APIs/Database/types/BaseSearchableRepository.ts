export interface BaseSearchableRepository<DataType extends object, SearchOptions = undefined> {
    /**
     * Search the repository for all items with the specified needle
     * @param needle
     * @param options
     */
    search(needle: string, options?: Partial<SearchOptions>): Promise<Array<DataType>>;
}
