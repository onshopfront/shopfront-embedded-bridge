import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export type LocalDatabaseCriteriaTypeUnion =
    "sell-item" |
    "sell-total" |
    "discount-item-amount" |
    "discount-total-amount" |
    "discount-percentage" |
    "sell-rate" |
    "quantity-only";

interface LocalDatabaseCriteriaItem {
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

interface BasePromotionRepository extends BaseRepository<
    LocalDatabasePromotion
>, BaseSearchableRepository<LocalDatabasePromotion> {
    /**
     * Update a promotion's data
     * @param id
     * @param update
     */
    update(id: string, update: Partial<LocalDatabasePromotion>): Promise<void>;

    /**
     * Retrieve all promotions that contain the specified product
     * @param product
     */
    getPromotionsForProduct(product: string): Promise<Array<string>>;

    /**
     * Retrieve all promotions with the specified category ID
     * @param id
     */
    getByCategory(id: string): Promise<Array<LocalDatabasePromotion>>;

    /**
     * Retrieve all promotions that pass the specified filter
     * @param filter
     */
    filter(filter: (promotion: LocalDatabasePromotion) => boolean): Promise<Array<LocalDatabasePromotion>>;

    /**
     * Simulates a promotion
     * TODO: Should this be removed?
     * @param originalId
     * @param promotion
     */
    simulate(originalId: null | string, promotion: null | LocalDatabasePromotion): Promise<void>;

    /**
     * Retrieve all promotions with the specified IDs
     * @param ids
     */
    getBulk(ids: Array<string>): Promise<Array<LocalDatabasePromotion>>;

    /**
     * TODO: Remove this one?
     */
    mapToCache(): Promise<void>;
};

export default BasePromotionRepository;
