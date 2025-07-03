import { SaleUpdate, SaleUpdateChanges } from "../../Actions/SaleUpdate.js";
import { BaseCurrentSale } from "./BaseCurrentSale.js";
import { InvalidSaleDeviceError, SaleCancelledError } from "./Exceptions.js";
import { SaleCustomer } from "./SaleCustomer.js";
import { SalePayment } from "./SalePayment.js";
import { SaleProduct } from "./SaleProduct.js";

export class CurrentSale extends BaseCurrentSale {
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
