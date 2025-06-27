import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseClassification {
    name: string;
    uuid: string;
    mdb_id: number | undefined;
}

export interface LocalDatabaseCategory extends LocalDatabaseClassification {
    metcash_msc: string | undefined;
}

type BaseClassificationRepository =
    BaseRepository<LocalDatabaseClassification> &
    BaseSearchableRepository<LocalDatabaseClassification>;

export default BaseClassificationRepository;
