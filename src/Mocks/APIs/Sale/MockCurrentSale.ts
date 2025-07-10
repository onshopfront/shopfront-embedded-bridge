import { BaseCurrentSale } from "../../../APIs/Sale/BaseCurrentSale.js";
import { ProductNotExistsError, SaleCancelledError } from "../../../APIs/Sale/Exceptions.js";
import {
    SaleCustomer,
    SalePayment,
    SaleProduct,
    ShopfrontSaleState,
} from "../../../APIs/Sale/index.js";
import { DirectShopfrontEvent } from "../../../ApplicationEvents.js";
import { MockApplication } from "../../MockApplication.js";

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

export class MockCurrentSale extends BaseCurrentSale {
    constructor(application: MockApplication, saleState?: ShopfrontSaleState) {
        super(application, saleState ?? emptySaleState);
    }

    /**
     * Fires the event trigger
     */
    protected async triggerEvent(event: DirectShopfrontEvent): Promise<void> {
        if(this.application instanceof MockApplication) {
            await this.application.fireEvent(event);
        } else {
            throw new Error("Manually firing events is only supported in the `MockApplication`");
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
     * Round the price to the specified decimal place
     */
    protected roundNumber(price: number, precision = 2): number {
        const multiplier = Math.pow(10, precision);

        return Math.round(price * multiplier) / multiplier;
    }

    /**
     * Updates the sale total by adding the specified `amount`
     */
    protected updateSaleTotal(amount: number): void {
        this.sale.totals.sale += amount;
        this.sale.totals.sale = this.roundNumber(this.sale.totals.sale);
    };

    /**
     * Updates the paid total by adding the specified `amount`
     */
    protected updatePaidTotal(amount: number): void {
        this.sale.totals.paid += amount;
        this.sale.totals.paid = this.roundNumber(this.sale.totals.paid);
    };

    /**
     * Updates the sale total when a product's price is changed
     */
    protected handleSaleProductPriceChange(index: number, currentPrice: number, newPrice: number): void {
        // Editing the property directly to avoid triggering the `wasPriceModified` flag
        this.products[index]["price"] = newPrice;

        const difference = newPrice - currentPrice;

        this.updateSaleTotal(difference);
    };

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

            const newPrice = this.roundNumber(currentRate * this.products[index].getQuantity());

            this.handleSaleProductPriceChange(index, currentPrice, newPrice);

            await this.triggerEvent("SALE_UPDATE_PRODUCTS");

            return;
        } catch(e) {
            // We want to throw the error unless it's because the product isn't in the sale
            if(!(e instanceof ProductNotExistsError)) {
                throw e;
            }
        }

        product["indexAddress"] = this.products.length === 0 ? [ 0 ] : [ this.products.length ];
        product["edited"] = false;

        this.products.push(this.cloneProduct(product));

        this.updateSaleTotal(product.getPrice() || 0);

        await this.triggerEvent("SALE_ADD_PRODUCT");
        await this.triggerEvent("SALE_UPDATE_PRODUCTS");
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

        const index = this.getIndexOfProduct(product);

        this.products.splice(index, 1);

        this.updateSaleTotal((product.getPrice() || 0) * -1);

        // Reshuffle the index addresses
        for(let i = 0, l = this.products.length; i < l; i++) {
            this.products[i]["indexAddress"] = [ i ];
        }

        await this.triggerEvent("SALE_REMOVE_PRODUCT");
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

        this.updatePaidTotal(payment.getAmount() - (payment.getCashout() || 0));

        const remaining = this.roundNumber(this.sale.totals.sale - this.sale.totals.paid);

        if(remaining <= 0) {
            this.clearSale();
            await this.triggerEvent("SALE_CLEAR");
        }
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

        this.updatePaidTotal(reversed.getAmount());
    }

    /**
     * @inheritDoc
     */
    public async addCustomer(customer: SaleCustomer): Promise<void> {
        this.checkIfCancelled();

        this.customer = customer;

        await this.triggerEvent("SALE_ADD_CUSTOMER");
    }

    /**
     * @inheritDoc
     */
    public async removeCustomer(): Promise<void> {
        this.checkIfCancelled();

        this.customer = null;

        await this.triggerEvent("SALE_REMOVE_CUSTOMER");
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

        const index = this.getIndexOfProduct(product);

        if(product.wasQuantityModified()) {
            const currentPrice = this.products[index].getPrice() || 0;
            const currentRate = this.roundNumber(currentPrice / this.products[index].getQuantity());

            this.products[index]["quantity"] = product.getQuantity();

            const newPrice = this.roundNumber(currentRate * product.getQuantity());

            this.handleSaleProductPriceChange(index, currentPrice, newPrice);
        }

        if(product.wasPriceModified()) {
            const currentPrice = this.products[index].getPrice() || 0;
            const newPrice = product.getPrice() || 0;

            this.handleSaleProductPriceChange(index, currentPrice, newPrice);
        }

        if(product.wasMetaDataModified()) {
            this.products[index]["metaData"] = product.getMetaData();
        }

        product.clearModificationFlags();

        await this.triggerEvent("SALE_UPDATE_PRODUCTS");
    }

    /**
     * Retrieves the index of a product in the sale
     */
    protected getIndexOfProduct(product: SaleProduct): number {
        const index = this.products.findIndex((p) => p.getId() === product.getId());

        if(index === -1) {
            throw new ProductNotExistsError();
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
