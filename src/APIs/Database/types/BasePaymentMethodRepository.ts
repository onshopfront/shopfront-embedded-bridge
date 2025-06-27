import BaseRepository from "./BaseRepository.js";

export type PaymentMethodTypeUnion =
    "global" |
    "cash" |
    "eftpos" |
    "giftcard" |
    "voucher" |
    "cheque" |
    "pc-eftpos" |
    "linkly-vaa" |
    "direct-deposit" |
    "tyro" |
    "custom";

export interface LocalDatabasePaymentMethod {
    action: string;
    actual_denominations: string;
    allow_cash_out: boolean;
    always_open_drawer: boolean;
    always_print: boolean;
    background_colour: string;
    cashout_method_id: null | string;
    default_pay_exact: boolean;
    denominations: string;
    gateway_url: string;
    name: string;
    surcharge: string;
    text_colour: string;
    type: PaymentMethodTypeUnion;
    updated_at: string;
    use_rounding: boolean;
    uuid: string;
}

interface BasePaymentMethodRepository extends BaseRepository<LocalDatabasePaymentMethod> {
    /**
     * Retrieve all payment methods with the specified type
     * @param type
     */
    getByType(type: PaymentMethodTypeUnion | Array<PaymentMethodTypeUnion>): Promise<Array<LocalDatabasePaymentMethod>>;
}

export default BasePaymentMethodRepository;
