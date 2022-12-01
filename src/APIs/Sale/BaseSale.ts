import { SaleCustomer } from "./SaleCustomer";
import { SalePayment } from "./SalePayment";
import { SaleProduct } from "./SaleProduct";

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
     *
     * @param {BaseSale} sale
     * @protected
     */
    protected hydrate(sale: BaseSale): void {
        this.sale = sale.sale;
        this.customer = sale.customer;
        this.payments = sale.payments;
        this.products = sale.products;
    }

    /**
     * Get the products that are currently on the sale.
     *
     * @returns {Array<SaleProduct>}
     */
    public getProducts(): Array<SaleProduct> {
        return this.products;
    }

    /**
     * Get the payments that are currently on the sale.
     *
     * @returns {Array<SalePayment>}
     */
    public getPayments(): Array<SalePayment> {
        return this.payments;
    }

    /**
     * Get the current customer on the sale.
     *
     * @returns {SaleCustomer | null}
     */
    public getCustomer(): null | SaleCustomer {
        return this.customer;
    }

    /**
     * Get the register.
     *
     * @returns {string | undefined}
     */
    public getRegister(): string | undefined {
        return this.sale.register;
    }

    /**
     * Get the client id.
     *
     * @returns {string | null}
     */
    public getClientId(): string | undefined {
        return this.sale.clientId;
    }

    /**
     * Get the current sale total on the sale.
     *
     * @returns {number}
     */
    public getSaleTotal(): number {
        return this.sale.totals.sale;
    }

    /**
     * Get the current paid total on the sale.
     *
     * @returns {number}
     */
    public getPaidTotal(): number {
        return this.sale.totals.paid;
    }

    /**
     * Get the current savings total on the sale.
     *
     * @returns {number}
     */
    public getSavingsTotal(): number {
        return this.sale.totals.savings;
    }

    /**
     * Get the current discount total on the sale.
     *
     * @returns {number}
     */
    public getDiscountTotal(): number {
        return this.sale.totals.discount;
    }

    /**
     * Get the linked to value on the sale.
     *
     * @returns {string}
     */
    public getLinkedTo(): string {
        return this.sale.linkedTo;
    }

    /**
     * Get the refund reason on the sale.
     *
     * @returns {string}
     */
    public getRefundReason(): string {
        return this.sale.refundReason;
    }

    /**
     * Get the price set on the sale.
     *
     * @returns {string | null}
     */
    public getPriceSet(): string | null {
        return this.sale.priceSet;
    }

    /**
     * Get the external sale note (visible to the customer).
     *
     * @returns {string}
     */
    public getExternalNote(): string {
        return this.sale.notes.sale;
    }

    /**
     * Get the internal sale note.
     *
     * @returns {string}
     */
    public getInternalNote(): string {
        return this.sale.notes.internal;
    }

    /**
     * Get the order reference (visible to the customer).
     *
     * @returns {string}
     */
    public getOrderReference(): string {
        return this.sale.orderReference;
    }

    /**
     * Get the current meta data for the sale
     *
     * @returns {Record<string, unknown>}
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
