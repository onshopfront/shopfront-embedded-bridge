import { LocalDatabaseContact } from "./BaseCustomerRepository.js";
import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export type LocalEmailFormatUnion = "inline" | "csv" | "pdf";

export interface LocalDatabaseTransferee {
    name: string;
    uuid: string;
    contact: LocalDatabaseContact;
    email_format: LocalEmailFormatUnion;
    order_automatic_email: boolean;
}

type BaseTransfereeRepository =
    BaseRepository<LocalDatabaseTransferee> &
    BaseSearchableRepository<LocalDatabaseTransferee>;

export default BaseTransfereeRepository;
