import { SaleUpdate, SaleUpdateChanges } from "../../Actions/SaleUpdate.js";
import { Application } from "../../Application.js";
import { BaseSale } from "./BaseSale.js";
import { InvalidSaleDeviceError, SaleCancelledError } from "./Exceptions.js";
import { Sale } from "./Sale.js";
import { SaleCustomer } from "./SaleCustomer.js";
import { SalePayment } from "./SalePayment.js";
import { SaleProduct } from "./SaleProduct.js";
import { ShopfrontSaleState } from "./ShopfrontSaleState.js";

export interface CurrentSaleInterface {
    /**
     * Update the sale to be the latest sale that exists on the sell screen.
     */
    refreshSale(): Promise<void>;
    /**
     * Cancel the current sale in progress.
     */
    cancelSale(): Promise<void>;
    /**
     * Add a product to the sale.
     * @param product
     */
    addProduct(product: SaleProduct): Promise<void>;
    /**
     * Remove a product from the sale.
     * It's highly recommended that you pass in a product that has been retrieved using sale.getProducts().
     * @param product
     */
    removeProduct(product: SaleProduct): Promise<void>;
    /**
     * Add a payment to the sell screen.
     *
     * If you specify a payment with a status, it will bypass the payment gateway (i.e. it won't request that the
     * user takes money from the customer).
     *
     * If you don't specify a cashout amount, it will automatically determine if the payment method normally requests
     * cashout (from the payment method settings).
     * @param payment
     */
    addPayment(payment: SalePayment): Promise<void>;
    /**
     * Reverse a payment on the sell screen.
     *
     * This is used to issue a refund to the customer. The sale payment amount should be positive.
     * @param payment
     */
    reversePayment(payment: SalePayment): Promise<void>;
    /**
     * Add a customer to the sale.
     * If there is already a customer on the sale this will override that customer.
     * @param customer
     */
    addCustomer(customer: SaleCustomer): Promise<void>;
    /**
     * Remove the customer from the current sale.
     * If there is no customer currently on the sale this will be ignored.
     * If there are "on account" or loyalty payments still on the sale, this will be ignored.
     */
    removeCustomer(): Promise<void>;
    /**
     * Set the external note for the sale.
     * @param note The note to set.
     * @param append Whether to append the note to the current sale note.
     */
    setExternalNote(note: string, append?: boolean): Promise<void>;
    /**
     * Set the internal note for the sale.
     * @param note The note to set.
     * @param append Whether to append the note to the current sale note.
     */
    setInternalNote(note: string, append?: boolean): Promise<void>;
    /**
     * Set the order reference to the provided string.
     * @param reference
     */
    setOrderReference(reference: string): Promise<void>;
    /**
     * Set the meta-data of the sale, this will override the previous meta data.
     * @param metaData
     */
    setMetaData(metaData: Record<string, unknown>): Promise<void>;
    /**
     * Update a product's details; currently this can update quantity, price and metadata
     * @param product
     */
    updateProduct(product: SaleProduct): Promise<void>;
}

export class CurrentSale extends BaseSale implements CurrentSaleInterface {
    protected application: Application;
    protected cancelled: boolean;

    /**
     * Create a sale from a sale state.
     * It's highly recommend to not construct a sale manually, instead use application.getCurrentSale().
     * @param application
     * @param saleState
     */
    constructor(application: Application, saleState: ShopfrontSaleState) {
        super(Sale.buildSaleData(saleState));

        this.application = application;
        this.cancelled   = false;
    }

    /**
     * @inheritDoc
     */
    public async refreshSale(): Promise<void> {
        this.checkIfCancelled();

        const newSale = await this.application.getCurrentSale();

        if(newSale === false) {
            throw new InvalidSaleDeviceError();
        }

        this.hydrate(newSale);
    }

    /**
     * Check if the sale has already been cancelled, if it has, throw a SaleCancelledError.
     */
    protected checkIfCancelled(): void {
        if(this.cancelled) {
            throw new SaleCancelledError();
        }
    }

    /**
     * Send a sale update to Shopfront.
     * @param update
     */
    protected sendSaleUpdate(update: SaleUpdate<keyof SaleUpdateChanges>): Promise<void> {
        this.checkIfCancelled();
        this.application.send(update);

        return this.refreshSale();
    }

    /**
     * @inheritDoc
     */
    public async cancelSale(): Promise<void> {
        await this.sendSaleUpdate(new SaleUpdate("SALE_CANCEL", {}));
        this.cancelled = true;
    }

    /**
     * @inheritDoc
     */
    public addProduct(product: SaleProduct): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_ADD", {
            id          : product.getId(),
            quantity    : product.getQuantity(),
            price       : product.getPrice(),
            indexAddress: product.getIndexAddress(),
            metaData    : product.getMetaData(),
        }));
    }

    /**
     * @inheritDoc
     */
    public removeProduct(product: SaleProduct): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_REMOVE", {
            id          : product.getId(),
            indexAddress: product.getIndexAddress(),
        }));
    }

    /**
     * @inheritDoc
     */
    public addPayment(payment: SalePayment): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PAYMENT_ADD", {
            id     : payment.getId(),
            amount : payment.getAmount(),
            cashout: payment.getCashout(),
            status : payment.getStatus(),
        }));
    }

    /**
     * @inheritDoc
     */
    public reversePayment(payment: SalePayment): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("PAYMENT_REVERSE", {
            id     : payment.getId(),
            amount : payment.getAmount(),
            cashout: payment.getCashout(),
            status : payment.getStatus(),
        }));
    }

    /**
     * @inheritDoc
     */
    public addCustomer(customer: SaleCustomer): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("CUSTOMER_ADD", {
            id: customer.getId(),
        }));
    }

    /**
     * @inheritDoc
     */
    public removeCustomer(): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("CUSTOMER_REMOVE", {}));
    }

    /**
     * @inheritDoc
     */
    public setExternalNote(note: string, append = false): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_EXTERNAL_NOTE", {
            note,
            append,
        }));
    }

    /**
     * @inheritDoc
     */
    public setInternalNote(note: string, append = false): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_INTERNAL_NOTE", {
            note,
            append,
        }));
    }

    /**
     * @inheritDoc
     */
    public setOrderReference(reference: string): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_ORDER_REFERENCE", {
            reference,
        }));
    }

    /**
     * @inheritDoc
     */
    public setMetaData(metaData: Record<string, unknown>): Promise<void> {
        return this.sendSaleUpdate(new SaleUpdate("SALE_META_DATA", {
            metaData,
        }));
    }

    /**
     * @inheritDoc
     */
    public updateProduct(product: SaleProduct): Promise<void> {
        const updateData: SaleUpdateChanges["PRODUCT_UPDATE"] = {
            id          : product.getId(),
            indexAddress: product.getIndexAddress(),
        };

        if(product.wasQuantityModified()) {
            updateData.quantity = product.getQuantity();
        }

        if(product.wasPriceModified()) {
            updateData.price = product.getPrice();
        }

        if(product.wasMetaDataModified()) {
            updateData.metaData = product.getMetaData();
        }

        product.clearModificationFlags();

        return this.sendSaleUpdate(new SaleUpdate("PRODUCT_UPDATE", updateData));
    }
}
