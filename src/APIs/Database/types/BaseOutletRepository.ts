import { LocalDatabaseContact } from "./BaseCustomerRepository.js";
import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseOutlet {
    loyalty_enabled: boolean;
    loyalty_name: string;
    has_kitchen_screen: boolean;
    name: string;
    business_number: string;
    contact: LocalDatabaseContact | null;
    logo: string | null;
    settings: Record<string, unknown>;
    uuid: string;
}

export interface BaseOutletRepository extends BaseRepository<LocalDatabaseOutlet> {
    /**
     * Update the outlet data
     */
    update(id: string, changes: Partial<LocalDatabaseOutlet>): Promise<void>;
}
