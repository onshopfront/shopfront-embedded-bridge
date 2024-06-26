import { ShopfrontSalePayment } from "./ShopfrontSaleState";
import UUID from "../../Utilities/UUID";

export enum SalePaymentStatus {
    APPROVED  = "completed",
    DECLINED  = "failed",
    CANCELLED = "cancelled"
}

export class SalePayment {
    public readonly internalId: string;

    protected id: string;
    protected type?: string;
    protected status?: SalePaymentStatus;
    protected amount: number;
    protected cashout?: number;
    protected rounding?: number;
    protected metaData: Record<string, unknown> = {};

    constructor(id: string, amount: number, cashout?: number, status?: SalePaymentStatus) {
        this.internalId = UUID.generate();

        this.id      = id;
        this.amount  = amount;
        this.cashout = cashout;
        this.status  = status;
    }

    /**
     * Hydrate a sale payment from the SaleState.
     *
     * @internal
     * @param {ShopfrontSalePayment} payment
     * @returns {SalePayment}
     * @constructor
     */
    public static HydrateFromState(payment: ShopfrontSalePayment): SalePayment {
        let status = SalePaymentStatus.APPROVED;
        switch(payment.status) {
            case "failed":
                status = SalePaymentStatus.DECLINED;
                break;
            case "cancelled":
                status = SalePaymentStatus.CANCELLED;
                break;
        }

        const hydrated = new SalePayment(payment.method, payment.amount, payment.cashout, status);
        hydrated.setInternal(payment);

        return hydrated;
    }

    /**
     * Set the internal data for the payment.
     * This method is for hydration of the payment from Shopfront, it's highly recommend that you DO NOT use this method.
     *
     * @internal
     * @param {ShopfrontSalePayment} data
     */
    public setInternal(data: ShopfrontSalePayment) {
        this.type     = data.type;
        this.rounding = data.rounding;
        this.metaData = JSON.parse(data.metadata);
    }

    /**
     * Get the ID of the sale payment method.
     *
     * @returns {string}
     */
    public getId() {
        return this.id;
    }

    /**
     * Get the type of payment method this is.
     *
     * @returns {string | undefined}
     */
    public getType() {
        return this.type;
    }

    /**
     * Get the status of this payment method.
     *
     * @returns {SalePaymentStatus | undefined}
     */
    public getStatus() {
        return this.status;
    }

    /**
     * Get the value of this payment method.
     *
     * @returns {number}
     */
    public getAmount() {
        return this.amount;
    }

    /**
     * Get the cashout amount paid for on this payment method.
     *
     * @returns {number | undefined}
     */
    public getCashout() {
        return this.cashout;
    }

    /**
     * Get the amount of rounding applied to this payment method.
     *
     * @returns {number | undefined}
     */
    public getRounding() {
        return this.rounding;
    }

    /**
     * Get the metadata attached to this payment method
     *
     * @returns {Record<string, unknown>}
     */
    public getMetaData() {
        return this.metaData;
    }
}
