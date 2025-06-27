import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabaseComponent {
    add_price: number;
    quantity: number;
    remove_price: number;
    uuid: string;
}

export interface LocalDatabaseCost {
    outlet_id: string;
    average_cost: number;
    last_cost: number;
}

export interface LocalDatabaseInventory {
    outlet_id: string;
    single_level: number;
    case_level: number;
    single_reorder_level: number;
    case_reorder_level: number;
    single_reorder_amount: number;
    case_reorder_amount: number;
    single_reorder_limit: number | null;
    case_reorder_limit: number | null;
    single_max_quantity: number | null;
    case_max_quantity: number | null;
    reorder_rounding: "none" | "ceiling" | "floor" | "natural";
}

export interface LocalDatabaseLoyalty {
    classification_id: string;
    classification_type: string;
    loyalty_value: number;
    outlet_id: string;
    quantity: number;
    redeem_value: null | number;
}

export interface LocalDatabasePrice {
    price: number;
    price_set_id: null | string;
    quantity: number;
    loyalty_value?: null | string; // I think this can be safely removed
    redemption_value?: null | string; // I think this can be safely removed
}

export type ProductTypeUnion = "normal" | "basket" | "voucher" | "package" | "component";
export type ProductStatusUnion = "active" | "inactive" | "not-selling" | "not-purchasing";

export interface LocalDatabaseProduct {
    additional: Record<string, string>;
    average_cost: number;
    alternate_names: Array<{ host: string; quantity: number | null; name: string; }>;
    barcodes: Array<{
        code: string;
        host_deleted_at: string | null;
        quantity: string;
        template: string | null;
    }>;
    brand_id: null | string;
    case_quantity: number;
    category_id: null | string;
    code_index: Array<string>;
    components: Array<LocalDatabaseComponent>;
    core_supplier_id: null | string;
    cost: string;
    cost_percentage: boolean;
    costs: Array<LocalDatabaseCost>;
    cost_tax_rate: null | { amount: number; uuid: string; };
    description: string;
    family_id: null | string;
    image: null | string;
    inventory: Array<LocalDatabaseInventory>;
    last_cost: number;
    last_supplier_id: null | string;
    loyalty_rates: Array<LocalDatabaseLoyalty>;
    mdb_id: null | number;
    name: string;
    name_index: Array<string>;
    order_notes: string;
    invoice_notes: string;
    parents: Array<string>;
    prices: Array<LocalDatabasePrice>;
    request_price: boolean;
    request_quantity: boolean;
    status: ProductStatusUnion;
    prevent_manual_discounts: boolean;
    ignore_price_host_changes: boolean;
    ignore_barcode_host_changes: boolean;
    suppliers: Array<{ supplier_code: string; uuid: string; minimum_order_quantity: number; }>;
    supplier_ids: Array<string>;
    supplier_codes: Array<string>;
    tags: Array<string>;
    tax_rate: null | { amount: string; uuid: string; };
    track_inventory: boolean;
    type: ProductTypeUnion;
    use_barcode_templates: boolean;
    use_scales: boolean;
    uuid: string;
}

export interface ProductRepositorySearchOptions {
    name: boolean;
    barcode: boolean | string;
    quantityCheck: boolean;
    quantityCount: number;
    sort: boolean;
    filter: (product: LocalDatabaseProduct) => boolean;
    exact: boolean;
    limit: number;
}

export interface ProductSearchDataType {
    quantity?: number;
    kind?: "product";
    searchBarcode?: string;
}

export type ProductSearchResultType = LocalDatabaseProduct & ProductSearchDataType;

export type ProductClassificationUnion = "category" |
    "brand" |
    "family" |
    "tag" |
    "supplier" |
    "supplier_code";

interface BaseProductRepository extends BaseRepository<
    LocalDatabaseProduct
>, BaseSearchableRepository<
    ProductSearchResultType,
    ProductRepositorySearchOptions
> {
    /**
     * Retrieve all products with the specified classification type and classification ID
     * @param classificationType
     * @param uuid
     */
    getFromClassification(
        classificationType: ProductClassificationUnion,
        uuid: string
    ): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Retrieve all products with the specified status
     * @param status
     */
    getByStatus(status: ProductStatusUnion | Array<ProductStatusUnion>): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Retrieve all products with the specified type
     * @param type
     */
    getByType(type: ProductTypeUnion | Array<ProductTypeUnion>): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Retrieve all products with the specified IDs
     * @param ids
     */
    getBulk(ids: Array<string>): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Retrieve all products with the specified MDB ID
     * @param mdbId
     */
    getByMDBId(mdbId: number): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Retrieve all products with the specified supplier codes
     * @param supplierCodes
     */
    getBySupplierCodes(supplierCodes: Array<string>): Promise<Array<LocalDatabaseProduct>>;

    /**
     * Update a product's data
     * @param id
     * @param changes
     */
    update(id: string, changes: Partial<LocalDatabaseProduct>): Promise<void>;

    /**
     * Clear the local product data cache
     */
    clearCache(): void;
};

export default BaseProductRepository;
