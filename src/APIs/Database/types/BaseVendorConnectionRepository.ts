import type BaseRepository from "./BaseRepository.js";
import { type BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseVendorConnection {
    uuid: string;
    name: string;
}

export type BaseVendorConnectionRepository =
    BaseRepository<LocalDatabaseVendorConnection> &
    BaseSearchableRepository<LocalDatabaseVendorConnection>;
