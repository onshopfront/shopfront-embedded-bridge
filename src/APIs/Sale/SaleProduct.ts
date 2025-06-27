import UUID from "../../Utilities/UUID.js";
import {
    ShopfrontSaleProduct,
    ShopfrontSaleProductPromotions,
    ShopfrontSaleProductType,
} from "./ShopfrontSaleState.js";

export class SaleProduct {
    public readonly internalId: string;

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
    protected promotions: ShopfrontSaleProductPromotions = {};
    protected metaData: Record<string, unknown> = {};
    protected mapped?: string;
    protected quantityModified: boolean;
    protected priceModified: boolean;
    protected metaDataModified: boolean;

    constructor(id: string, quantity: number, price?: number, indexAddress?: Array<number>) {
        this.internalId = UUID.generate();

        this.id           = id;
        this.quantity     = quantity;
        this.price        = price;
        this.indexAddress = indexAddress || [];

        this.contains = [];
        this.edited   = typeof price !== "undefined";
        this.note     = "";

        this.quantityModified = false;
        this.priceModified = false;
        this.metaDataModified = false;
    }

    /**
     * Hydrate a sale product from the SaleState.
     * @internal
     * @param product
     * @param indexAddress
     */
    public static HydrateFromState(product: ShopfrontSaleProduct, indexAddress: Array<number>): SaleProduct {
        const hydrated = new SaleProduct(product.uuid, product.quantity, product.prices.price, indexAddress);

        hydrated.setInternal(product, indexAddress);

        return hydrated;
    }

    /**
     * Append a product to this product's list of contained products.
     * @param product
     */
    protected appendProduct(product: SaleProduct): void {
        this.contains.push(product);
    }

    /**
     * Set the internal data for the product.
     * This method is for hydration of the product from Shopfront,
     * it's highly recommend that you DO NOT use this method.
     * @internal
     * @param data
     * @param indexAddress
     */
    public setInternal(data: ShopfrontSaleProduct, indexAddress: Array<number>): void {
        this.name          = data.name;
        this.type          = data.type;
        this.taxRateAmount = data.tax?.amount || 0;
        this.note          = data.note;
        this.edited        = data.edited;
        this.caseQuantity  = data.caseQuantity;
        this.promotions    = data.promotions;
        this.metaData      = data.metaData;
        this.mapped        = data.mapped;

        for(let i = 0, l = data.products.length; i < l; i++) {
            this.appendProduct(SaleProduct.HydrateFromState(data.products[i], [
                ...indexAddress,
                i,
            ]));
        }
    }

    /**
     * Get the ID of the product.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Gets the mapped id for the product.
     * Used when the product goes through the fulfilment process mapping
     */
    public getMapped(): string | undefined {
        return this.mapped;
    }

    /**
     * Get the current sale quantity of the product.
     */
    public getQuantity(): number {
        return this.quantity;
    }

    /**
     * Sets the current sale quantity of the product
     */
    public setQuantity(quantity: number): void {
        this.quantity = quantity;
        this.quantityModified = true;
    }

    /**
     * Get the current price of the product.
     */
    public getPrice(): number | undefined {
        return this.price;
    }

    /**
     * Sets the current price of the product
     */
    public setPrice(price: number): void {
        this.price = price;
        this.priceModified = true;
    }

    /**
     * Get the index address of the product.
     * This is the internal address of where the product is in the sale.
     * (e.g. if the address is [1, 3] it's the fourth contained product in the second sale line).
     */
    public getIndexAddress(): Array<number> {
        return this.indexAddress;
    }

    /**
     * Get the name of the product.
     */
    public getName(): string | undefined {
        return this.name;
    }

    /**
     * Get the type of product this product is.
     */
    public getType(): ShopfrontSaleProductType | undefined {
        return this.type;
    }

    /**
     * Get the tax rate amount.
     * This is the rate of the tax rate (e.g. 10 is a tax rate of 10%).
     */
    public getTaxRateAmount(): number | undefined {
        return this.taxRateAmount;
    }

    /**
     * Get the sale note attached to this product.
     */
    public getNote(): string {
        return this.note;
    }

    /**
     * Get the products this product contains.
     */
    public getContains(): Array<SaleProduct> {
        return this.contains;
    }

    /**
     * Get whether this product has been "edited".
     * Typically, being edited just means that this product has been discounted.
     */
    public getEdited(): boolean {
        return this.edited;
    }

    /**
     * Get the case quantity for this product.
     */
    public getCaseQuantity(): number | undefined {
        return this.caseQuantity;
    }

    /**
     * Get the current active promotions for the product.
     */
    public getPromotions(): ShopfrontSaleProductPromotions {
        return this.promotions;
    }

    /**
     * Get the meta-data for the product.
     */
    public getMetaData(): Record<string, unknown> {
        return this.metaData;
    }

    /**
     * Set the metaData for a product
     * @param key
     * @param value
     */
    public setMetaData(key: string, value: unknown): void {
        this.metaData[key] = value;
        this.metaDataModified = true;
    }

    /**
     * Returns whether the product's quantity was modified externally
     * @internal
     */
    public wasQuantityModified(): boolean {
        return this.quantityModified;
    }

    /**
     * Returns whether the product's price was modified externally
     * @internal
     */
    public wasPriceModified(): boolean {
        return this.priceModified;
    }

    /**
     * Returns whether the product's metaData was modified externally
     * @internal
     */
    public wasMetaDataModified(): boolean {
        return this.metaDataModified;
    }

    /**
     * Sets a product's modification flags to false
     * @internal
     */
    public clearModificationFlags(): void {
        this.quantityModified = false;
        this.priceModified = false;
        this.metaDataModified = false;
    }
}
