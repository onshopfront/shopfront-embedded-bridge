import { type BaseSaleData } from "../APIs/Sale/BaseSale.js";
import { Sale, SaleProduct, type ShopfrontSalePaymentStatus } from "../APIs/Sale/index.js";

export interface SaleProductData {
    uuid: string;
    caseQuantity: number;
    quantity: number;
    price: number;
    metaData: Record<string, unknown>;
    products: Array<SaleProductData>;
    note: string;
}

export interface SalePaymentData {
    method: string;
    type: undefined | string;
    amount: number;
    status: undefined | ShopfrontSalePaymentStatus;
    rounding: number;
    cashout: number;
    metaData: Record<string, unknown>;
}

export interface SaleData extends BaseSaleData {
    customer: null | string;
    payments: Array<SalePaymentData>;
    products: Array<SaleProductData>;
}

/**
 * Builds a Shopfront sale product from the embedded product data
 */
function buildSaleProductData(product: SaleProduct): SaleProductData {
    const price = product.getPrice();

    if(typeof price !== "number") {
        throw new TypeError("Sale Product must have price when creating the sale.");
    }

    const caseQuantity = product.getCaseQuantity();

    if(typeof caseQuantity !== "number") {
        throw new TypeError("Sale Product must have case quantity when creating the sale.");
    }

    return {
        uuid    : product.getId(),
        quantity: product.getQuantity(),
        metaData: product.getMetaData(),
        products: product.getContains().map(buildSaleProductData),
        note    : product.getNote(),
        caseQuantity,
        price,
    };
}

/**
 * Builds a Shopfront sale from the embedded sale data
 */
export function buildSaleData(sale: Sale): SaleData {
    const customer = sale.getCustomer();

    return {
        internalId: sale.getClientId(),
        register  : sale.getRegister(),
        notes     : {
            internal: sale.getInternalNote(),
            sale    : sale.getExternalNote(),
        },
        totals: {
            sale    : sale.getSaleTotal(),
            paid    : sale.getPaidTotal(),
            savings : sale.getSavingsTotal(),
            discount: sale.getDiscountTotal(),
        },
        linkedTo      : sale.getLinkedTo(),
        orderReference: sale.getOrderReference(),
        refundReason  : sale.getRefundReason(),
        priceSet      : sale.getPriceSet(),
        metaData      : sale.getMetaData(),
        customer      : customer ? customer.getId() : null,
        products      : sale.getProducts().map(buildSaleProductData),
        payments      : sale.getPayments().map(payment => ({
            method  : payment.getId(),
            type    : payment.getType(),
            amount  : payment.getAmount(),
            status  : payment.getStatus(),
            rounding: payment.getRounding() || 0,
            cashout : payment.getCashout() || 0,
            metaData: payment.getMetaData(),
        })),
    };
}
