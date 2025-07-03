import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface CustomerRepositorySearchOptions {
    name: boolean;
    code: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
    customerGroups: Array<string>;
    exactMatch: boolean;
    sort: boolean;
    limit: number;
    filter: ((customer: LocalDatabaseCustomer) => boolean) | undefined;
}

export interface LocalDatabaseContact {
    address_city: string;
    address_country: string;
    address_postcode: string;
    address_state: string;
    address_street_1: string;
    address_street_2: string;
    address_suburb: string;
    email: string;
    facebook: string;
    fax: string;
    mobile: string;
    phone: string;
    twitter: string;
    website: string;
}

export interface LocalDatabaseCustomer {
    account_limit: null | number;
    account_receipt: null | string;
    allow_account_sales: boolean;
    autoprint_account_receipt: boolean;
    autoprint_receipt: boolean;
    autoprint_parked_receipt: boolean;
    billing: LocalDatabaseContact;
    birthday: null | string;
    business_number: string;
    client_id: string;
    code: string;
    comments: string;
    company: string;
    current_owing: number;
    customer_group_id: null | string;
    delivery: LocalDatabaseContact;
    disable_promotions: boolean;
    email: string;
    first_name: string;
    full_name: string;
    gender: string;
    invoice_message: string;
    last_name: string;
    loyalty: boolean;
    loyalty_points: number;
    loyalty_rate: number | null;
    override_customer_group: boolean;
    phones: Array<string>;
    pricelist_id: null | string;
    receipt: null | string;
    require_order_reference: 0 | 1;
    uuid: string;
}

export interface BaseCustomerRepository extends BaseRepository<
    LocalDatabaseCustomer
>, BaseSearchableRepository<
    LocalDatabaseCustomer,
    CustomerRepositorySearchOptions
> {
    /**
     * Retrieve all customers with the specified customer group ID
     * @param customerGroupId
     */
    getByCustomerGroup(customerGroupId: string): Promise<Array<LocalDatabaseCustomer>>;

    /**
     * Retrieve all customers with the specified price list ID
     * @param priceListId
     */
    getByPriceList(priceListId: string): Promise<Array<LocalDatabaseCustomer>>;
}
