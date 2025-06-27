import { CurrentSaleInterface } from "../../../APIs/Sale/CurrentSale.js";
import { SaleCancelledError } from "../../../APIs/Sale/Exceptions.js";
import {
    BaseSale,
    Sale,
    SaleCustomer,
    SalePayment,
    SaleProduct,
    ShopfrontSaleState,
} from "../../../APIs/Sale/index.js";
import { DirectShopfrontEvent } from "../../../ApplicationEvents.js";

const emptySaleState: ShopfrontSaleState = {
    clientId: undefined,
    register: undefined,
    products: [],
    customer: false,
    payments: [],
    notes   : {
        sale    : "",
        internal: "",
    },
    totals: {
        sale    : 0,
        paid    : 0,
        savings : 0,
        discount: 0,
    },
    linkedTo      : "",
    orderReference: "",
    refundReason  : "",
    priceSet      : null,
    metaData      : {},
};

export class MockedCurrentSale extends BaseSale implements CurrentSaleInterface {
    protected cancelled: boolean;
    protected eventTrigger: ((event: DirectShopfrontEvent) => void) | undefined;

    constructor(saleState?: ShopfrontSaleState) {
        super(Sale.buildSaleData(saleState ?? emptySaleState));

        this.cancelled = false;
    }

    /**
     * Allows the mocked sale to trigger sale events
     */
    public injectEventTrigger(trigger: (event: DirectShopfrontEvent) => void): void {
        this.eventTrigger = trigger;
    }

    /**
     * Fires the event trigger (if one was injected)
     */
    protected triggerEvent(event: DirectShopfrontEvent): void {
        if(this.eventTrigger) {
            this.eventTrigger(event);
        }
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
     * @inheritDoc
     */
    public async refreshSale(): Promise<void> {
        /* Do nothing */
    }

    /**
     * @inheritDoc
     */
    public async cancelSale(): Promise<void> {
        this.clearSale();

        this.cancelled = true;
    }

    /**
     * @inheritDoc
     */
    public async addProduct(product: SaleProduct): Promise<void> {
        this.checkIfCancelled();

        // Check if product already exists in the sale
        try {
            // If it does, update it
            const index = this.getIndexOfProduct(product);

            // TODO: Does not currently support not consolidating
            // If a product is added again with a different price, the new price is ignored
            // This behaviour was taken from the `addProductToSale` function in the POS

            const currentPrice = this.products[index].getPrice() || 0;

            const currentRate = currentPrice / this.products[index].getQuantity();

            // Editing the property directly to avoid triggering the `wasQuantityModified` flag
            this.products[index]["quantity"] += product.getQuantity();

            const newPrice = Math.round((currentRate * this.products[index].getQuantity()) * 100) / 100;

            // Editing the property directly to avoid triggering the `wasPriceModified` flag
            this.products[index]["price"] = newPrice;

            const difference = newPrice - currentPrice;

            this.sale.totals.sale += difference;
            this.sale.totals.sale = Math.round(this.sale.totals.sale * 100) / 100;

            this.triggerEvent("SALE_UPDATE_PRODUCTS");

            return;
        } catch(e) {
            // Product doesn't exist in the sale, we can add it
        }

        // If it doesn't, add it
        product["indexAddress"] = this.products.length === 0 ? [ 0 ] : [ this.products.length ];
        product["edited"] = false;

        this.products.push(this.cloneProduct(product));

        // Update the totals
        this.sale.totals.sale += product.getPrice() || 0;
        this.sale.totals.sale = Math.round(this.sale.totals.sale * 100) / 100;

        this.triggerEvent("SALE_ADD_PRODUCT");
        this.triggerEvent("SALE_UPDATE_PRODUCTS");
    }

    /**
     * @inheritDoc
     */
    public async removeProduct(product: SaleProduct): Promise<void> {
        this.checkIfCancelled();

        if(this.products.length === 1 && this.sale.totals.paid !== 0) {
            throw new Error(
                "Cannot remove the last product from the sale if the sale contains an outstanding balance"
            );
        }

        /* Remove Product */
        const index = this.getIndexOfProduct(product);

        this.products.splice(index, 1);

        this.sale.totals.sale -= product.getPrice() || 0;
        this.sale.totals.sale = Math.round(this.sale.totals.sale * 100) / 100;

        // Reshuffle the index addresses
        for(let i = 0, l = this.products.length; i < l; i++) {
            this.products[i]["indexAddress"] = [ i ];
        }

        this.triggerEvent("SALE_REMOVE_PRODUCT");
    }

    /**
     * @inheritDoc
     */
    public async addPayment(payment: SalePayment): Promise<void> {
        this.checkIfCancelled();

        this.payments.push(this.clonePayment(payment));

        if(payment.getStatus() === "cancelled" || payment.getStatus() === "failed") {
            // No need to update any of the totals
            return;
        }

        const cashout = payment.getCashout() || 0;

        this.sale.totals.paid += (payment.getAmount() - cashout);
        this.sale.totals.paid = Math.round(this.sale.totals.paid * 100) / 100;

        // TODO: If the payment reduces the remaining total to 0, should the sale auto-complete?
    }

    /**
     * @inheritDoc
     */
    public async reversePayment(payment: SalePayment): Promise<void> {
        this.checkIfCancelled();

        // Should not be reverse-able past 0
        if(this.sale.totals.paid - payment.getAmount() < 0) {
            throw new Error("The paid total cannot be less than 0");
        }

        const reversed = this.clonePayment(payment, true);

        this.payments.push(reversed);

        if(payment.getStatus() === "cancelled" || payment.getStatus() === "failed") {
            // No need to update any of the totals
            return;
        }

        this.sale.totals.paid += reversed.getAmount();
        this.sale.totals.paid = Math.round(this.sale.totals.paid * 100) / 100;
    }

    /**
     * @inheritDoc
     */
    public async addCustomer(customer: SaleCustomer): Promise<void> {
        this.checkIfCancelled();

        /* Add Customer */
        this.customer = customer;

        this.triggerEvent("SALE_ADD_CUSTOMER");
    }

    /**
     * @inheritDoc
     */
    public async removeCustomer(): Promise<void> {
        this.checkIfCancelled();

        this.customer = null;

        this.triggerEvent("SALE_REMOVE_CUSTOMER");
    }

    /**
     * @inheritDoc
     */
    public async setExternalNote(note: string, append?: boolean): Promise<void> {
        this.checkIfCancelled();

        let toSet;

        if(append) {
            toSet = `${this.sale.notes.sale}${note}`;
        } else {
            toSet = note;
        }

        this.sale.notes.sale = toSet;
    }

    /**
     * @inheritDoc
     */
    public async setInternalNote(note: string, append?: boolean): Promise<void> {
        this.checkIfCancelled();

        let toSet;

        if(append) {
            toSet = `${this.sale.notes.internal}${note}`;
        } else {
            toSet = note;
        }

        this.sale.notes.internal = toSet;
    }

    /**
     * @inheritDoc
     */
    public async setOrderReference(reference: string): Promise<void> {
        this.checkIfCancelled();

        this.sale.orderReference = reference;
    }

    /**
     * @inheritDoc
     */
    public async setMetaData(metaData: Record<string, unknown>): Promise<void> {
        this.checkIfCancelled();

        this.sale.metaData = metaData;
    }

    /**
     * @inheritDoc
     */
    public async updateProduct(product: SaleProduct): Promise<void> {
        this.checkIfCancelled();

        // Update product
        const index = this.getIndexOfProduct(product);

        if(product.wasQuantityModified()) {
            const currentPrice = this.products[index].getPrice() || 0;
            const currentRate = Math.round((currentPrice / this.products[index].getQuantity()) * 100) / 100;

            this.products[index]["quantity"] = product.getQuantity();

            const newPrice = Math.round((currentRate * product.getQuantity()) * 100) / 100;

            this.products[index]["price"] = newPrice;

            const difference = newPrice - currentPrice;

            this.sale.totals.sale += difference;
            this.sale.totals.sale = Math.round(this.sale.totals.sale * 100) / 100;
        }

        if(product.wasPriceModified()) {
            const currentPrice = this.products[index].getPrice() || 0;
            const newPrice = product.getPrice() || 0;

            this.products[index]["price"] = newPrice;

            const difference = newPrice - currentPrice;

            // Update the sale total
            this.sale.totals.sale += difference;
            this.sale.totals.sale = Math.round(this.sale.totals.sale * 100) / 100;
        }

        if(product.wasMetaDataModified()) {
            this.products[index]["metaData"] = product.getMetaData();
        }

        product.clearModificationFlags();

        this.triggerEvent("SALE_UPDATE_PRODUCTS");
    }

    /**
     * Retrieves the index of a product in the sale
     */
    protected getIndexOfProduct(product: SaleProduct): number {
        const index = this.products.findIndex((p) => p.getId() === product.getId());

        if(index === -1) {
            throw new Error("Product does not exist in the sale");
        }

        return index;
    }

    /**
     * Clones a sale product so it can be added to the sale
     */
    protected cloneProduct(product: SaleProduct): SaleProduct {
        const clone = new SaleProduct(
            product.getId(),
            product.getQuantity(),
            product.getPrice(),
            product.getIndexAddress()
        );

        clone["note"] = product["note"];
        clone["contains"] = product["contains"];
        clone["edited"] = product["edited"];
        clone["promotions"] = product["promotions"];
        clone["metaData"] = product["metaData"];
        clone["quantityModified"] = product["quantityModified"];
        clone["priceModified"] = product["priceModified"];
        clone["metaDataModified"] = product["metaDataModified"];

        return clone;
    }

    /**
     * Clones a sale payment so it can be added to the sale
     */
    protected clonePayment(payment: SalePayment, reverse = false): SalePayment {
        const updatedAmount = reverse ? payment.getAmount() * -1 : payment.getAmount();

        const clone = new SalePayment(
            payment.getId(),
            updatedAmount,
            payment.getCashout(),
            payment.getStatus()
        );

        clone["metaData"] = payment["metaData"];

        return clone;
    }

    /**
     * Clear the sale data
     */
    public clearSale(): void {
        this.products.length = 0;
        this.products.push(...[]);

        this.payments.length = 0;
        this.payments.push(...[]);

        this.customer = null;
        this.sale = {
            register: undefined,
            clientId: undefined,
            notes   : {
                sale    : "",
                internal: "",
            },
            totals: {
                sale    : 0,
                paid    : 0,
                savings : 0,
                discount: 0,
            },
            linkedTo      : "",
            orderReference: "",
            refundReason  : "",
            priceSet      : null,
            metaData      : {},
        };
    }
}
