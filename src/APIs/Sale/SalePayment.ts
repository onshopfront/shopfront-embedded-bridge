import UUID from "../../Utilities/UUID.js";
import { ShopfrontSalePayment } from "./ShopfrontSaleState.js";

export enum SalePaymentStatus {
    APPROVED = "completed",
    DECLINED = "failed",
    CANCELLED = "cancelled",
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

        this.id = id;
        this.amount = amount;
        this.cashout = cashout;
        this.status = status;
    }

    /**
     * Hydrate a sale payment from the SaleState.
     * @internal
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
     * This method is for hydration of the payment from Shopfront,
     * it's highly recommend that you DO NOT use this method.
     * @internal
     */
    public setInternal(data: ShopfrontSalePayment): void {
        this.type = data.type;
        this.rounding = data.rounding;
        this.metaData = JSON.parse(data.metadata);
    }

    /**
     * Get the ID of the sale payment method.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Get the type of payment method this is.
     */
    public getType(): string | undefined {
        return this.type;
    }

    /**
     * Get the status of this payment method.
     */
    public getStatus(): SalePaymentStatus | undefined {
        return this.status;
    }

    /**
     * Get the value of this payment method.
     */
    public getAmount(): number {
        return this.amount;
    }

    /**
     * Get the cashout amount paid for on this payment method.
     */
    public getCashout(): number | undefined {
        return this.cashout;
    }

    /**
     * Get the amount of rounding applied to this payment method.
     */
    public getRounding(): number | undefined {
        return this.rounding;
    }

    /**
     * Get the metadata attached to this payment method
     */
    public getMetaData(): Record<string, unknown> {
        return this.metaData;
    }
}
