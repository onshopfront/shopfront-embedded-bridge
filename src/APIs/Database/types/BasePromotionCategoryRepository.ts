import type BaseRepository from "./BaseRepository.js";
import { type BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabasePromotionCategory {
    source: null | string;
    name: string;
    uuid: string;
    show_on_order: boolean;
    include_in_integrations: boolean;
}

export type BasePromotionCategoryRepository =
    BaseRepository<LocalDatabasePromotionCategory> &
    BaseSearchableRepository<LocalDatabasePromotionCategory>;
