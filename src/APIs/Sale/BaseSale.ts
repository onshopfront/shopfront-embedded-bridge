import type { SaleCustomer } from "./SaleCustomer.js";
import type { SalePayment } from "./SalePayment.js";
import type { SaleProduct } from "./SaleProduct.js";

export interface BaseSaleData {
    register: string | undefined;
    clientId: string | undefined;
    notes: {
        internal: string;
        sale: string;
    };
    totals: {
        sale: number;
        paid: number;
        savings: number;
        discount: number;
    };
    linkedTo: string;
    orderReference: string;
    refundReason: string;
    priceSet: string | null;
    metaData: Record<string, unknown>;
}

export interface SaleData extends BaseSaleData {
    customer: null | SaleCustomer;
    payments: Array<SalePayment>;
    products: Array<SaleProduct>;
}

export abstract class BaseSale {
    protected sale: BaseSaleData;
    protected customer: null | SaleCustomer;
    protected payments: Array<SalePayment>;
    protected products: Array<SaleProduct>;

    protected constructor({ customer, payments, products, ...sale }: SaleData) {
        this.sale = sale;
        this.customer = customer;
        this.payments = payments;
        this.products = products;
    }

    /**
     * Updates the sale data to be inline with the new sale
     */
    protected hydrate(sale: BaseSale): void {
        this.sale = sale.sale;
        this.customer = sale.customer;
        this.payments = sale.payments;
        this.products = sale.products;
    }

    /**
     * Get the products that are currently on the sale.
     */
    public getProducts(): Array<SaleProduct> {
        return this.products;
    }

    /**
     * Get the payments that are currently on the sale.
     */
    public getPayments(): Array<SalePayment> {
        return this.payments;
    }

    /**
     * Get the current customer on the sale.
     */
    public getCustomer(): null | SaleCustomer {
        return this.customer;
    }

    /**
     * Get the register.
     */
    public getRegister(): string | undefined {
        return this.sale.register;
    }

    /**
     * Get the client id.
     */
    public getClientId(): string | undefined {
        return this.sale.clientId;
    }

    /**
     * Get the current sale total on the sale.
     */
    public getSaleTotal(): number {
        return this.sale.totals.sale;
    }

    /**
     * Get the current paid total on the sale.
     */
    public getPaidTotal(): number {
        return this.sale.totals.paid;
    }

    /**
     * Get the current savings total on the sale.
     */
    public getSavingsTotal(): number {
        return this.sale.totals.savings;
    }

    /**
     * Get the current discount total on the sale.
     */
    public getDiscountTotal(): number {
        return this.sale.totals.discount;
    }

    /**
     * Get the linked to value on the sale.
     */
    public getLinkedTo(): string {
        return this.sale.linkedTo;
    }

    /**
     * Get the refund reason on the sale.
     */
    public getRefundReason(): string {
        return this.sale.refundReason;
    }

    /**
     * Get the price set on the sale.
     */
    public getPriceSet(): string | null {
        return this.sale.priceSet;
    }

    /**
     * Get the external sale note (visible to the customer).
     */
    public getExternalNote(): string {
        return this.sale.notes.sale;
    }

    /**
     * Get the internal sale note.
     */
    public getInternalNote(): string {
        return this.sale.notes.internal;
    }

    /**
     * Get the order reference (visible to the customer).
     */
    public getOrderReference(): string {
        return this.sale.orderReference;
    }

    /**
     * Get the current meta data for the sale
     */
    public getMetaData(): Record<string, unknown> {
        return this.sale.metaData;
    }

    public abstract addProduct(product: SaleProduct): Promise<void>;
    public abstract removeProduct(product: SaleProduct): Promise<void>;
    public abstract addPayment(payment: SalePayment): Promise<void>;
    public abstract addCustomer(customer: SaleCustomer): Promise<void>;
    public abstract removeCustomer(): Promise<void>;
    public abstract setExternalNote(note: string, append?: boolean): Promise<void>;
    public abstract setInternalNote(note: string, append?: boolean): Promise<void>;
    public abstract setOrderReference(reference: string): Promise<void>;
    public abstract setMetaData(metaData: Record<string, unknown>): Promise<void>;
    public abstract updateProduct(product: SaleProduct): Promise<void>;
}
