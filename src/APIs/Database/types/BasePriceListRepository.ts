import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

type Override<Original, ToOverride> = Omit<Original, keyof ToOverride> & ToOverride;

export type PriceListRuleBaseUnion =
    "discount-percentage" |
    "discount-amount" |
    "discount-item-amount" |
    "cost-percentage" |
    "cost-amount" |
    "last-cost-percentage" |
    "last-cost-amount";

export type PriceListRuleUnion = PriceListRuleBaseUnion | "override";

export interface PriceListRulePrice {
    quantity: string;
    price: string;
}

export interface LocalDatabasePriceListFallback {
    min_rule: "no-minimum" | PriceListRuleBaseUnion;
    min_rule_amount: string;
    rule: PriceListRuleBaseUnion;
    rule_amount: string;
}

export interface LocalDatabasePriceListRule extends LocalDatabasePriceListFallback {
    uuid: string;
}

export type LocalDatabasePriceListWithPricesRule = Override<LocalDatabasePriceListRule, {
    min_rule: "no-minimum" | PriceListRuleUnion;
    rule: PriceListRuleUnion;
    min_prices: Array<PriceListRulePrice>;
    prices: Array<PriceListRulePrice>;
}>;

export type PriceListItemTypeUnion =
    "products" |
    "categories" |
    "brands" |
    "families" |
    "tags";

export interface LocalDatabasePriceList {
    active: boolean;
    allow_higher_price: boolean;
    brands: Array<LocalDatabasePriceListRule>;
    categories: Array<LocalDatabasePriceListRule>;
    families: Array<LocalDatabasePriceListWithPricesRule>;
    tags: Array<LocalDatabasePriceListRule>;
    excludes: Record<PriceListItemTypeUnion, Array<string>>;
    fallback_rule: null | LocalDatabasePriceListFallback;
    name: string;
    products: Array<LocalDatabasePriceListWithPricesRule>;
    uuid: string;
}

type BasePriceListRepository =
    BaseRepository<LocalDatabasePriceList> &
    BaseSearchableRepository<LocalDatabasePriceList>;

export default BasePriceListRepository;
