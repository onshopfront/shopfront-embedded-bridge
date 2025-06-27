import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseVendorConnection {
    uuid: string;
    name: string;
}

type BaseVendorConnectionRepository =
    BaseRepository<LocalDatabaseVendorConnection> &
    BaseSearchableRepository<LocalDatabaseVendorConnection>;

export default BaseVendorConnectionRepository;
