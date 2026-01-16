import type BaseRepository from "./BaseRepository.js";
import { type BaseSearchableRepository } from "./BaseSearchableRepository.js";

export type LocalDatabaseCriteriaTypeUnion =
    "sell-item" |
    "sell-total" |
    "discount-item-amount" |
    "discount-total-amount" |
    "discount-percentage" |
    "sell-rate" |
    "quantity-only";

export interface LocalDatabaseCriteriaItem {
    uuid: string;
    rebate: string | number;
}

export interface LocalDatabasePromotionCriteria {
    products: Array<LocalDatabaseCriteriaItem>;
    brands: Array<LocalDatabaseCriteriaItem>;
    categories: Array<LocalDatabaseCriteriaItem>;
    families: Array<LocalDatabaseCriteriaItem>;
    tags: Array<LocalDatabaseCriteriaItem>;
    buy_amount: number;
    buy_amount_max: number | null;
    buy_amount_type: "quantity" | "amount";
    discount_amount: number;
    discount_everyday_promotions: boolean;
    exclude_count_quantity: boolean;
    exclude_price_points: boolean;
    min_quantity: number | null;
    mixed_only: boolean;
    optional: boolean;
    quantity_type: "exact" | "more";
    type: LocalDatabaseCriteriaTypeUnion;
    excludes: {
        products: Array<string>;
        categories: Array<string>;
        brands: Array<string>;
        families: Array<string>;
        tags: Array<string>;
    };
}

export interface LocalDatabasePromotion {
    active: boolean;
    available_to: null | Array<string>;
    criteria: Array<LocalDatabasePromotionCriteria>;
    end: string | null;
    express: boolean;
    mdb_id: number | null;
    mix_criteria: boolean;
    name: string;
    outlets: Array<string>;
    promotion_category_id: string | null;
    start: string | null;
    uuid: string;
    has_schedule: boolean;
    activated_by?: null | string;
}

export interface BasePromotionRepository extends BaseRepository<
    LocalDatabasePromotion
>, BaseSearchableRepository<LocalDatabasePromotion> {
    /**
     * Update a promotion's data
     */
    update(id: string, update: Partial<LocalDatabasePromotion>): Promise<void>;

    /**
     * Retrieve all promotions that contain the specified product
     */
    getPromotionsForProduct(product: string): Promise<Array<string>>;

    /**
     * Retrieve all promotions with the specified category ID
     */
    getByCategory(id: string): Promise<Array<LocalDatabasePromotion>>;

    /**
     * Retrieve all promotions that pass the specified filter
     */
    filter(filter: (promotion: LocalDatabasePromotion) => boolean): Promise<Array<LocalDatabasePromotion>>;

    /**
     * Retrieve all promotions with the specified IDs
     */
    getBulk(ids: Array<string>): Promise<Array<LocalDatabasePromotion>>;
}
