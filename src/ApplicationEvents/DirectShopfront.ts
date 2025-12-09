import { SaleAddCustomer } from "../Events/DirectEvents/SaleAddCustomer.js";
import { SaleAddProduct } from "../Events/DirectEvents/SaleAddProduct.js";
import { SaleChangeQuantity } from "../Events/DirectEvents/SaleChangeQuantity.js";
import { SaleClear } from "../Events/DirectEvents/SaleClear.js";
import { SaleRemoveCustomer } from "../Events/DirectEvents/SaleRemoveCustomer.js";
import { SaleRemoveProduct } from "../Events/DirectEvents/SaleRemoveProduct.js";
import { SaleUpdateProducts } from "../Events/DirectEvents/SaleUpdateProducts.js";
import type { SaleEventProduct } from "../Events/DirectEvents/types/SaleEventData.js";
import type { MaybePromise } from "../Utilities/MiscTypes.js";
import type { ListenableFromShopfrontEvent } from "./ToShopfront.js";

export interface SaleAddProductEvent {
    product: SaleEventProduct;
    indexAddress: Array<number>;
}

export interface SaleRemoveProductEvent {
    indexAddress: Array<number>;
}

export interface SaleChangeQuantityEvent {
    indexAddress: Array<number>;
    amount: number;
    absolute: boolean;
}

export interface SaleUpdateProductsEvent {
    products: Array<SaleEventProduct>;
}

export interface SaleAddCustomerEvent {
    customer: {
        uuid: string;
    };
}

export interface DirectShopfrontEventData {
    SALE_ADD_PRODUCT: SaleAddProductEvent;
    SALE_REMOVE_PRODUCT: SaleRemoveProductEvent;
    SALE_CHANGE_QUANTITY: SaleChangeQuantityEvent;
    SALE_UPDATE_PRODUCTS: SaleUpdateProductsEvent;
    SALE_ADD_CUSTOMER: SaleAddCustomerEvent;
    SALE_REMOVE_CUSTOMER: undefined;
    SALE_CLEAR: undefined;
}

export interface DirectShopfrontCallbacks {
    SALE_ADD_PRODUCT: (event: DirectShopfrontEventData["SALE_ADD_PRODUCT"]) => MaybePromise<void>;
    SALE_REMOVE_PRODUCT: (event: DirectShopfrontEventData["SALE_REMOVE_PRODUCT"]) => MaybePromise<void>;
    SALE_CHANGE_QUANTITY: (event: DirectShopfrontEventData["SALE_CHANGE_QUANTITY"]) => MaybePromise<void>;
    SALE_UPDATE_PRODUCTS: (event: DirectShopfrontEventData["SALE_UPDATE_PRODUCTS"]) => MaybePromise<void>;
    SALE_ADD_CUSTOMER: (event: DirectShopfrontEventData["SALE_ADD_CUSTOMER"]) => MaybePromise<void>;
    SALE_REMOVE_CUSTOMER: () => MaybePromise<void>;
    SALE_CLEAR: () => MaybePromise<void>;
}

export interface DirectShopfront {
    SALE_ADD_PRODUCT: SaleAddProduct;
    SALE_REMOVE_PRODUCT: SaleRemoveProduct;
    SALE_CHANGE_QUANTITY: SaleChangeQuantity;
    SALE_UPDATE_PRODUCTS: SaleUpdateProducts;
    SALE_ADD_CUSTOMER: SaleAddCustomer;
    SALE_REMOVE_CUSTOMER: SaleRemoveCustomer;
    SALE_CLEAR: SaleClear;
}

export type DirectShopfrontEvent = keyof DirectShopfront;

export const directShopfrontEvents: Array<DirectShopfrontEvent> = [
    "SALE_ADD_PRODUCT",
    "SALE_REMOVE_PRODUCT",
    "SALE_UPDATE_PRODUCTS",
    "SALE_CHANGE_QUANTITY",
    "SALE_ADD_CUSTOMER",
    "SALE_REMOVE_CUSTOMER",
    "SALE_CLEAR",
] as const;

/**
 * Checks whether the event is a direct Shopfront event
 */
export const isDirectShopfrontEvent = (
    event: DirectShopfrontEvent | ListenableFromShopfrontEvent
): event is DirectShopfrontEvent => {
    return directShopfrontEvents.includes(event as DirectShopfrontEvent);
};
