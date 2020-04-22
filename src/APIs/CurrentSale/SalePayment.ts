import {ShopfrontSalePayment, ShopfrontSalePaymentStatus} from "./ShopfrontSaleState";

export enum SalePaymentStatus {
    APPROVED  = "completed",
    DECLINED  = "failed",
    CANCELLED = "cancelled"
}

export class SalePayment {
    protected id: string;
    protected type?: string;
    protected status?: ShopfrontSalePaymentStatus;
    protected amount: number;
    protected cashout?: number;
    protected rounding?: number;

    constructor(id: string, amount: number, cashout?: number, status?: SalePaymentStatus) {
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
     * @returns {ShopfrontSalePaymentStatus | undefined}
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
     * Get the amount of rounding that has been applied to this payment method.
     *
     * @returns {number | undefined}
     */
    public getRounding() {
        return this.rounding;
    }
}
