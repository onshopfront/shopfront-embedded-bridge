import { BaseSale } from "./BaseSale";
import { ShopfrontSaleState } from "./ShopfrontSaleState";
import { SalePayment } from "./SalePayment";
import { SaleProduct } from "./SaleProduct";
import { SaleCustomer } from "./SaleCustomer";
import { Application } from "../../Application";
import { SaleUpdate, SaleUpdateChanges } from "../../Actions/SaleUpdate";
import { InvalidSaleDeviceError, SaleCancelledError } from "./Exceptions";
import { Sale } from "./Sale";

export class CurrentSale extends BaseSale {
    protected application: Application;
    protected cancelled: boolean;

    /**
     * Create a sale from a sale state.
     * It's highly recommend to not construct a sale manually, instead use application.getCurrentSale().
     *
     * @param {Application} application
     * @param {ShopfrontSaleState} saleState
     */
    constructor(application: Application, saleState: ShopfrontSaleState) {
        super(Sale.buildSaleData(saleState));

        this.application = application;
        this.cancelled   = false;
    }

    /**
     * Update the sale to be the latest sale that exists on the sell screen.
     *
     * @returns {Promise<void>}
     */
    public async refreshSale() {
        this.checkIfCancelled();

        const newSale = await this.application.getCurrentSale();

        if(newSale === false) {
            throw new InvalidSaleDeviceError();
        }

        this.hydrate(newSale);
    }

    /**
     * Check if the sale has already been cancelled, if it has, throw a SaleCancelledError.
     *
     * @protected
     */
    protected checkIfCancelled() {
        if(this.cancelled) {
            throw new SaleCancelledError();
        }
    }

    /**
     * Send a sale update to Shopfront.
     *
     * @protected
     * @param {SaleUpdate} update
     * @returns {Promise<void>}
     */
    protected sendSaleUpdate(update: SaleUpdate<keyof SaleUpdateChanges>): Promise<void> {
        this.checkIfCancelled();
        this.application.send(update);
        return this.refreshSale();
    }

    /**
     * Cancel the current sale in progress.
     *
     * @returns {Promise<void>}
     */
    public async cancelSale(): Promise<void> {
        await this.sendSaleUpdate(new SaleUpdate("SALE_CANCEL", {}));
        this.cancelled = true;
    }

    /**
     * Add a product to the sale.
     *
     * @param {SaleProduct} product
     * @returns {Promise<void>}
     */
    public addProduct(product: SaleProduct): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_ADD", {
            id: product.getId(),
            quantity: product.getQuantity(),
            price: product.getPrice(),
            indexAddress: product.getIndexAddress(),
            metaData: product.getMetaData(),
        }));
    }

    /**
     * Remove a product from the sale.
     * It's highly recommended that you pass in a product that has been retrieved using sale.getProducts().
     *
     * @param {SaleProduct} product
     * @returns {Promise<void>}
     */
    public removeProduct(product: SaleProduct): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_REMOVE", {
            id: product.getId(),
            indexAddress: product.getIndexAddress(),
        }));
    }

    /**
     * Add a payment to the sell screen.
     *
     * If you specify a payment with a status, it will bypass the payment gateway (i.e. it won't request that the
     * user takes money from the customer).
     *
     * If you don't specify a cashout amount, it will automatically determine if the payment method normally requests
     * cashout (from the payment method settings).
     *
     * @param {SalePayment} payment
     * @returns {Promise<void>}
     */
    public addPayment(payment: SalePayment): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PAYMENT_ADD", {
            id: payment.getId(),
            amount: payment.getAmount(),
            cashout: payment.getCashout(),
            status: payment.getStatus(),
        }));
    }

    /**
     * Reverse a payment on the sell screen.
     *
     * This is used to issue a refund to the customer. The sale payment amount should be positive.
     *
     * @param {SalePayment} payment
     * @returns {Promise<void>}
     */
    public reversePayment(payment: SalePayment): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PAYMENT_REVERSE", {
            id: payment.getId(),
            amount: payment.getAmount(),
            cashout: payment.getCashout(),
            status: payment.getStatus(),
        }));
    }

    /**
     * Add a customer to the sale.
     * If there is already a customer on the sale this will override that customer.
     *
     * @param {SaleCustomer} customer
     * @returns {Promise<void>}
     */
    public addCustomer(customer: SaleCustomer): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("CUSTOMER_ADD", {
            id: customer.getId(),
        }));
    }

    /**
     * Remove the customer from the current sale.
     * If there is no customer currently on the sale this will be ignored.
     * If there are "on account" or loyalty payments still on the sale, this will be ignored.
     *
     * @returns {Promise<void>}
     */
    public removeCustomer(): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("CUSTOMER_REMOVE", {}));
    }

    /**
     * Set the external note for the sale.
     *
     * @param {string} note The note to set.
     * @param {boolean} append Whether to append the note to the current sale note.
     * @returns {Promise<void>}
     */
    public setExternalNote(note: string, append = false): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_EXTERNAL_NOTE", {
            note,
            append,
        }));
    }

    /**
     * Set the internal note for the sale.
     *
     * @param {string} note The note to set.
     * @param {boolean} append Whether to append the note to the current sale note.
     * @returns {Promise<void>}
     */
    public setInternalNote(note: string, append = false): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_INTERNAL_NOTE", {
            note,
            append,
        }));
    }

    /**
     * Set the order reference to the provided string.
     *
     * @param {string} reference
     * @returns {Promise<void>}
     */
    public setOrderReference(reference: string): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_ORDER_REFERENCE", {
            reference,
        }));
    }

    /**
     * Set the meta data of the sale, this will override the previous meta data.
     *
     * @param metaData
     */
    public setMetaData(metaData: Record<string, unknown>): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_META_DATA", {
            metaData,
        }));
    }

    /**
     * Update a product's details, currently this only updates the top-level meta data
     * @param product
     */
    public updateProduct(product: SaleProduct): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_UPDATE", {
            id: product.getId(),
            indexAddress: product.getIndexAddress(),
            metaData: product.getMetaData(),
        }));
    }
}
