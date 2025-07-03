import BaseRepository from "./BaseRepository.js";

export interface LocalDatabaseCustomerDisplay {
    idle_display: string;
    main_colour: string;
    name: string;
    sale_display: string;
    text_colour: string;
    uuid: string;
}

export type BaseCustomerDisplayRepository = BaseRepository<LocalDatabaseCustomerDisplay>;
