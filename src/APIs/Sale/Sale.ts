import { BaseSale, SaleData } from "./BaseSale";
import { SaleCustomer } from "./SaleCustomer";
import { SalePayment } from "./SalePayment";
import { SaleProduct } from "./SaleProduct";
import { Application } from "../../Application";
import { ShopfrontSaleState } from "./ShopfrontSaleState";

export class Sale extends BaseSale {
    protected created = false;
    protected creating = false;

    constructor(data: SaleData) {
        super(data);
    }

    public async addCustomer(customer: SaleCustomer): Promise<void> {
        this.customer = customer;
    }

    public async addPayment(payment: SalePayment): Promise<void> {
        if (this.payments.find(p => p.internalId === payment.internalId)) {
            throw new TypeError("Payment has already been added to sale.");
        }

        this.payments.push(payment);
    }

    public async addProduct(product: SaleProduct): Promise<void> {
        if (this.products.find(p => p.internalId === product.internalId)) {
            throw new TypeError("Product has already been added to sale.");
        }

        this.products.push(product);
    }

    public async removeCustomer(): Promise<void> {
        this.customer = null;
    }

    public async removeProduct(product: SaleProduct): Promise<void> {
        const index = this.products.findIndex(p => p.internalId === product.internalId);
        if (index === -1) {
            throw new TypeError("Product could not be found in the sale.");
        }

        this.products.splice(index, 1);
    }

    public async removePayment(payment: SalePayment): Promise<void> {
        const index = this.payments.findIndex(p => p.internalId === payment.internalId);
        if (index === -1) {
            throw new TypeError("Payment could not be found in the sale.");
        }

        this.payments.splice(index, 1);
    }

    public async setExternalNote(note: string, append?: boolean): Promise<void> {
        if (append) {
            this.sale.notes.sale += note;
        } else {
            this.sale.notes.sale = note;
        }
    }

    public async setInternalNote(note: string, append?: boolean): Promise<void> {
        if (append) {
            this.sale.notes.internal += note;
        } else {
            this.sale.notes.internal = note;
        }
    }

    public async setMetaData(metaData: Record<string, unknown>): Promise<void> {
        this.sale.metaData = metaData;
    }

    public async setOrderReference(reference: string): Promise<void> {
        this.sale.orderReference = reference;
    }

    public async updateProduct(product: SaleProduct): Promise<void> {
        const index = this.products.findIndex(p => p.internalId === product.internalId);
        if (index === -1) {
            throw new TypeError("Product could not be found in the sale.");
        }

        this.products[index] = product;
    }

    /**
     * Create the sale on the server
     */
    public async create(application: Application): Promise<{
        success: boolean;
        message?: string;
    }> {
        if (this.creating) {
            throw new TypeError("Create function is currently running");
        }

        if (this.created) {
            throw new TypeError("Sale has already been created");
        }

        this.creating = true;

        const results = await application.createSale(this);
        if (results.success) {
            this.created = true;
        }

        this.creating = false;

        return results;
    }

    /**
     * Converts the sale state to the sale data
     * @param saleState
     */
    public static buildSaleData(saleState: ShopfrontSaleState): SaleData {
        return {
            register: saleState.register,
            clientId: saleState.clientId,
            notes: saleState.notes,
            totals: saleState.totals,
            linkedTo: saleState.linkedTo,
            orderReference: saleState.orderReference,
            refundReason: saleState.refundReason,
            priceSet: saleState.priceSet,
            metaData: saleState.metaData,
            customer: saleState.customer ? new SaleCustomer(saleState.customer.uuid) : null,
            payments: saleState.payments.map(SalePayment.HydrateFromState),
            products: saleState.products.map((product, index) => {
                return SaleProduct.HydrateFromState(product, [ index ]);
            }),
        };
    }
}
