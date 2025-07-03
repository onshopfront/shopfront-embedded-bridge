import BaseRepository from "./BaseRepository.js";

export type ShouldPrintOptions = "table" | "total" | "none";

export interface LocalDatabaseRegister {
    closure_print_settings: {
        account: ShouldPrintOptions;
        account_payments: ShouldPrintOptions;
        discounts: ShouldPrintOptions;
        gift_cards_redeemed: ShouldPrintOptions;
        gift_cards_sold: ShouldPrintOptions;
        movements: ShouldPrintOptions;
        payments: ShouldPrintOptions;
        refunds: ShouldPrintOptions;
        tax: ShouldPrintOptions;
        loyalty: ShouldPrintOptions;
        notes: boolean;
        tags: boolean;
        payment_subtypes: boolean;
        statistics: boolean;
    };
    close_register_tags: Array<string>;
    float: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    };
    surcharges?: Array<{
        id: number;
        type: "PERCENTAGE" | "FIXED";
        amount: number;
        taxRate: string | null;
        day: string;
        start: string;
        end: string;
        name: string;
        appliesTo: Array<{
            id: string;
            type: "Category" | "Tag";
        }> | null;
    }>;
    surcharging_enabled: boolean;
    name: string;
    outlet_id: string;
    payment_methods: Array<string>;
    settings: Record<string, unknown>;
    uuid: string;
}

export interface BaseRegisterRepository extends BaseRepository<LocalDatabaseRegister> {
    /**
     * Update a register's data
     */
    update(id: string, changes: Partial<LocalDatabaseRegister>): Promise<void>;
}
