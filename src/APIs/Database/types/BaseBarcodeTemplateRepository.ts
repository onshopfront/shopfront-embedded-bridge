import type BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseBarcodeTemplate {
    id: number;
    name: string;
    recalculate_quantity: boolean;
    template: string;
}

export type BaseBarcodeTemplateRepository = BaseRepository<LocalDatabaseBarcodeTemplate, number>;
