import { BaseApplication } from "../../BaseApplication.js";
import { BaseSale } from "./BaseSale.js";
import { Sale } from "./Sale.js";
import { SaleCustomer } from "./SaleCustomer.js";
import { SalePayment } from "./SalePayment.js";
import { SaleProduct } from "./SaleProduct.js";
import { ShopfrontSaleState } from "./ShopfrontSaleState.js";

export abstract class BaseCurrentSale extends BaseSale {
    protected application: BaseApplication;
    protected cancelled: boolean;

    /**
     * Create a sale from a sale state.
     * It's highly recommend to not construct a sale manually, instead use application.getCurrentSale().
     */
    constructor(application: BaseApplication, saleState: ShopfrontSaleState) {
        super(Sale.buildSaleData(saleState));

        this.application = application;
        this.cancelled = false;
    }

    /**
     * Update the sale to be the latest sale that exists on the sell screen.
     */
    public abstract refreshSale(): Promise<void>;

    /**
     * Cancel the current sale in progress.
     */
    public abstract cancelSale(): Promise<void>;

    /**
     * Add a product to the sale.
     */
    public abstract addProduct(product: SaleProduct): Promise<void>;

    /**
     * Remove a product from the sale.
     * It's highly recommended that you pass in a product that has been retrieved using sale.getProducts().
     */
    public abstract removeProduct(product: SaleProduct): Promise<void>;

    /**
     * Add a payment to the sell screen.
     *
     * If you specify a payment with a status, it will bypass the payment gateway (i.e. it won't request that the
     * user takes money from the customer).
     *
     * If you don't specify a cashout amount, it will automatically determine if the payment method normally requests
     * cashout (from the payment method settings).
     */
    public abstract addPayment(payment: SalePayment): Promise<void>;

    /**
     * Reverse a payment on the sell screen.
     *
     * This is used to issue a refund to the customer. The sale payment amount should be positive.
     */
    public abstract reversePayment(payment: SalePayment): Promise<void>;

    /**
     * Add a customer to the sale.
     * If there is already a customer on the sale this will override that customer.
     */
    public abstract addCustomer(customer: SaleCustomer): Promise<void>;

    /**
     * Remove the customer from the current sale.
     * If there is no customer currently on the sale this will be ignored.
     * If there are "on account" or loyalty payments still on the sale, this will be ignored.
     */
    public abstract removeCustomer(): Promise<void>;

    /**
     * Set the external note for the sale.
     * @param note The note to set.
     * @param append Whether to append the note to the current sale note.
     */
    public abstract setExternalNote(note: string, append?: boolean): Promise<void>;

    /**
     * Set the internal note for the sale.
     * @param note The note to set.
     * @param append Whether to append the note to the current sale note.
     */
    public abstract setInternalNote(note: string, append?: boolean): Promise<void>;

    /**
     * Set the order reference to the provided string.
     */
    public abstract setOrderReference(reference: string): Promise<void>;

    /**
     * Set the meta-data of the sale, this will override the previous meta data.
     */
    public abstract setMetaData(metaData: Record<string, unknown>): Promise<void>;

    /**
     * Update a product's details; currently this can update quantity, price and metadata
     */
    public abstract updateProduct(product: SaleProduct): Promise<void>;
}
