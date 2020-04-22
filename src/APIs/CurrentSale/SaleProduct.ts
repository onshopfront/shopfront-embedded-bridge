import {ShopfrontSaleProduct, ShopfrontSaleProductType} from "./ShopfrontSaleState";

export class SaleProduct {
    protected id: string;
    protected quantity: number;
    protected price?: number;
    protected indexAddress: Array<number>;
    protected name?: string;
    protected type?: ShopfrontSaleProductType;
    protected taxRateAmount?: number;
    protected note: string;
    protected contains: Array<SaleProduct>;
    protected edited: boolean;
    protected caseQuantity?: number;

    constructor(id: string, quantity: number, price?: number, indexAddress?: Array<number>) {
        this.id           = id;
        this.quantity     = quantity;
        this.price        = price;
        this.indexAddress = indexAddress || [];

        this.contains = [];
        this.edited   = typeof price !== "undefined";
        this.note     = "";
    }

    /**
     * Hydrate a sale product from the SaleState.
     *
     * @internal
     * @param {ShopfrontSaleProduct} product
     * @param {Array<number>} indexAddress
     * @returns {SaleProduct}
     * @constructor
     */
    public static HydrateFromState(product: ShopfrontSaleProduct, indexAddress: Array<number>): SaleProduct {
        const hydrated = new SaleProduct(product.uuid, product.quantity, product.prices.price, indexAddress);
        hydrated.setInternal(product, indexAddress);

        return hydrated;
    }

    /**
     * Append a product to this product's list of contained products.
     *
     * @protected
     * @param {SaleProduct} product
     */
    protected appendProduct(product: SaleProduct) {
        this.contains.push(product);
    }

    /**
     * Set the internal data for the product.
     * This method is for hydration of the product from Shopfront, it's highly recommend that you DO NOT use this method.
     *
     * @internal
     * @param {ShopfrontSaleProduct} data
     * @param {Array<number>} indexAddress
     */
    public setInternal(data: ShopfrontSaleProduct, indexAddress: Array<number>) {
        this.name          = data.name;
        this.type          = data.type;
        this.taxRateAmount = data.tax?.amount || 0;
        this.note          = data.note;
        this.edited        = data.edited;
        this.caseQuantity  = data.caseQuantity;

        for(let i = 0, l = data.products.length; i < l; i++) {
            this.appendProduct(SaleProduct.HydrateFromState(data.products[i], [
                ...indexAddress,
                i,
            ]));
        }
    }

    /**
     * Get the ID of the product.
     * @returns {string}
     */
    public getId() {
        return this.id;
    }

    /**
     * Get the current sale quantity of the product.
     * @returns {number}
     */
    public getQuantity() {
        return this.quantity;
    }

    /**
     * Get the current price of the product.
     * @returns {number | undefined}
     */
    public getPrice() {
        return this.price;
    }

    /**
     * Get the index address of the product.
     * This is the internal address of where the product is in the sale.
     * (e.g. if the address is [1, 3] it's the fourth contained product in the second sale line).
     *
     * @returns {Array<number>}
     */
    public getIndexAddress() {
        return this.indexAddress;
    }

    /**
     * Get the name of the product.
     *
     * @returns {string | undefined}
     */
    public getName() {
        return this.name;
    }

    /**
     * Get the type of product this product is.
     *
     * @returns {ShopfrontSaleProductType | undefined}
     */
    public getType() {
        return this.type;
    }

    /**
     * Get the tax rate amount.
     * This is the rate of the tax rate (e.g. 10 is a tax rate of 10%).
     *
     * @returns {number | undefined}
     */
    public getTaxRateAmount() {
        return this.taxRateAmount;
    }

    /**
     * Get the sale note attached to this product.
     *
     * @returns {string}
     */
    public getNote() {
        return this.note;
    }

    /**
     * Get the products this product contains.
     *
     * @returns {Array<SaleProduct>}
     */
    public getContains() {
        return this.contains;
    }

    /**
     * Get whether this product has been "edited".
     * Typically, being edited just means that this product has been discounted.
     *
     * @returns {boolean}
     */
    public getEdited() {
        return this.edited;
    }

    /**
     * Get the case quantity for this product.
     *
     * @returns {number | undefined}
     */
    public getCaseQuantity() {
        return this.caseQuantity;
    }
}
