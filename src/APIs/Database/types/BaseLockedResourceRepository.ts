import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseLockedResource {
    type: string;
    uuid: string;
    resource: string;
}

export interface BaseLockedResourceRepository extends BaseRepository<
    LocalDatabaseLockedResource
> {
    /**
     * Retrieve all locked resources with the specified resource
     */
    getByResource(resource: string): Promise<LocalDatabaseLockedResource>;
}
