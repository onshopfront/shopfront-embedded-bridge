import { LocalDatabaseContact } from "./BaseCustomerRepository.js";
import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseSupplier {
    account_number: string;
    business_number: string;
    comments: string;
    contact: LocalDatabaseContact;
    default_order_tax: "inc_tax" | "ex_tax" | "ex_wet";
    distribute_fees: "proportionally" | "evenly";
    distribute_freight: "items" | "cases" | "mixed";
    email_format: "inline" | "csv" | "pdf";
    fee_amount: number;
    mdb_id: null | number;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    order_automatic_email: boolean;
    order_notes: string;
    order_internal_notes: string;
    uuid: string;
    freight_included_on_invoices: boolean;
    freight_tax_id: string | null;
    fees_tax_id: string | null;
    minimum_order_value: null | number;
    maximum_order_value: null | number;
    allow_order_below_minimum: boolean;
    default_days_until_due: number | null;
    freight_fixed_cost_per_case: number | null;
    additional_contacts: Array<LocalDatabaseAdditionalContact>;
}

export interface LocalDatabaseAdditionalContact {
    name: string;
    contact: LocalDatabaseContact;
}

export type BaseSupplierRepository =
    BaseRepository<LocalDatabaseSupplier> &
    BaseSearchableRepository<LocalDatabaseSupplier>;
