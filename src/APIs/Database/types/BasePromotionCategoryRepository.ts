import BaseRepository from "./BaseRepository.js";
import { BaseSearchableRepository } from "./BaseSearchableRepository.js";

export interface LocalDatabasePromotionCategory {
    source: null | string;
    name: string;
    uuid: string;
    show_on_order: boolean;
    include_in_integrations: boolean;
}

type BasePromotionCategoryRepository =
    BaseRepository<LocalDatabasePromotionCategory> &
    BaseSearchableRepository<LocalDatabasePromotionCategory>;

export default BasePromotionCategoryRepository;
