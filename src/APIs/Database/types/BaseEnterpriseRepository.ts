import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseEnterprise {
    auth: string;
    id: string;
    name: string;
}

export type BaseEnterpriseRepository =
    BaseRepository<LocalDatabaseEnterprise> &
    BaseSearchableRepository<LocalDatabaseEnterprise>;
