import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseEnterprise {
    auth: string;
    id: string;
    name: string;
}

type BaseEnterpriseRepository =
    BaseRepository<LocalDatabaseEnterprise> &
    BaseSearchableRepository<LocalDatabaseEnterprise>;

export default BaseEnterpriseRepository;
