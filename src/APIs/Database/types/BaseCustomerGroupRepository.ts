import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseCustomerGroup {
    account_limit: number | null;
    account_receipt_id: string | null;
    allow_account_sales: boolean;
    auto_email_receipt: boolean;
    autoprint_account_receipt: boolean;
    autoprint_receipt: boolean;
    autoprint_parked_receipt: boolean;
    credit_terms: null | Array<string>;
    disable_promotions: boolean;
    email_receipt_id: null | string;
    loyalty: boolean;
    loyalty_rate: number | null;
    name: string;
    pricelist_id: null | string;
    receipt_id: null | string;
    statement_template_id: null | string;
    require_order_reference: 0 | 1;
    updated_at: string;
    uuid: string;
}

type BaseCustomerGroupRepository =
    BaseRepository<LocalDatabaseCustomerGroup> &
    BaseSearchableRepository<LocalDatabaseCustomerGroup>;

export default BaseCustomerGroupRepository;
