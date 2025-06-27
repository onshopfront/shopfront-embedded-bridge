import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseLockedResource {
    type: string;
    uuid: string;
    resource: string;
}

interface BaseLockedResourceRepository extends BaseRepository<
    LocalDatabaseLockedResource
> {
    /**
     * Retrieve all locked resources with the specified resource
     * @param resource
     */
    getByResource(resource: string): Promise<LocalDatabaseLockedResource>;
}

export default BaseLockedResourceRepository;
