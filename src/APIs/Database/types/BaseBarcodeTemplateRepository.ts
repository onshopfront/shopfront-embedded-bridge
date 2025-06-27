import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseBarcodeTemplate {
    id: number;
    name: string;
    recalculate_quantity: boolean;
    template: string;
}

type BaseBarcodeTemplateRepository = BaseRepository<LocalDatabaseBarcodeTemplate, number>;

export default BaseBarcodeTemplateRepository;
