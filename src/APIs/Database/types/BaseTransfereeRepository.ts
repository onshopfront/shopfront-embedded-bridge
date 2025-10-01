import { type LocalDatabaseContact } from "./BaseCustomerRepository.js";
import type BaseRepository from "./BaseRepository.js";
import { type BaseSearchableRepository } from "./BaseSearchableRepository.js";

export type LocalEmailFormatUnion = "inline" | "csv" | "pdf";

export interface LocalDatabaseTransferee {
    name: string;
    uuid: string;
    contact: LocalDatabaseContact;
    email_format: LocalEmailFormatUnion;
    order_automatic_email: boolean;
}

export type BaseTransfereeRepository =
    BaseRepository<LocalDatabaseTransferee> &
    BaseSearchableRepository<LocalDatabaseTransferee>;
