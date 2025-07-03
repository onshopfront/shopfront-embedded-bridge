import BaseRepository from "./BaseRepository.js";

export type KitchenDisplayRuleReady = "NOT_DONE" | "NOT_STARTED" | "STARTED" | "DONE";

export interface KitchenDisplayFilterRules {
    ready: KitchenDisplayRuleReady;
    categories: Array<string>;
    tags: Array<string>;
    registers: Array<string>;
    outlets: Array<string>;
}

export interface LocalKitchenScreen {
    uuid: string;
    name: string;
    rules: KitchenDisplayFilterRules;
}

export interface BaseKitchenScreenRepository extends BaseRepository<LocalKitchenScreen> {}
