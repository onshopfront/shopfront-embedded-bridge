import type BaseRepository from "./BaseRepository.js";
import type { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseClassification {
    name: string;
    uuid: string;
    mdb_id: number | undefined;
}

export interface LocalDatabaseCategory extends LocalDatabaseClassification {
    metcash_msc: string | undefined;
}

export type BaseClassificationRepository =
    BaseRepository<LocalDatabaseClassification> &
    BaseSearchableRepository<LocalDatabaseClassification>;
