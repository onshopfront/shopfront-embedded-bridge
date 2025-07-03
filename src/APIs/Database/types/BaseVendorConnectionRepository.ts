import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseVendorConnection {
    uuid: string;
    name: string;
}

export type BaseVendorConnectionRepository =
    BaseRepository<LocalDatabaseVendorConnection> &
    BaseSearchableRepository<LocalDatabaseVendorConnection>;
