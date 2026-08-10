import { assert, suite } from "@onshopfront/core/tests";
import type { SaleData } from "../../src/APIs/Sale/BaseSale.js";
import { Sale } from "../../src/APIs/Sale/Sale.js";
import { SalePayment, SalePaymentStatus } from "../../src/APIs/Sale/SalePayment.js";
import { buildSaleData } from "../../src/Utilities/SaleCreate.js";

const generateBlankSaleData = (): SaleData => {
    return {
        internalId    : "sale-id",
        register      : "register-id",
        customer      : null,
        linkedTo      : "",
        orderReference: "",
        metaData      : {},
        refundReason  : "",
        priceSet      : null,
        isCancellable : true,
        products      : [],
        payments      : [],
        totals        : {
            sale    : 0,
            paid    : 0,
            savings : 0,
            discount: 0,
        },
        notes: {
            internal: "",
            sale    : "",
        },
    };
};

suite("Testing the functions in the `SaleCreate` file", () => {
    suite("Testing the `buildSaleData` function", () => {
        test("The payment data can be built correctly", () => {
            const sale = new Sale({
                ...generateBlankSaleData(),
                payments: [
                    new SalePayment(
                        "sale-payment-a-id",
                        50,
                        0,
                        SalePaymentStatus.APPROVED,
                        {
                            metaData: {
                                key: "value",
                            },
                            subtype: "VISA",
                        }
                    ),
                    new SalePayment(
                        "sale-payment-b-id",
                        14.99,
                        0,
                        SalePaymentStatus.APPROVED,
                        {
                            metaData: {},
                        }
                    ),
                ],
                totals: {
                    sale    : 64.99,
                    paid    : 64.99,
                    savings : 0,
                    discount: 0,
                },
            });

            assert(buildSaleData(sale)).deepStrictEquals({
                internalId: "sale-id",
                register  : "register-id",
                notes     : {
                    internal: "",
                    sale    : "",
                },
                totals: {
                    sale    : 64.99,
                    paid    : 64.99,
                    savings : 0,
                    discount: 0,
                },
                linkedTo      : "",
                orderReference: "",
                refundReason  : "",
                priceSet      : null,
                metaData      : {},
                customer      : null,
                products      : [],
                payments      : [
                    {
                        method  : "sale-payment-a-id",
                        type    : undefined,
                        amount  : 50,
                        status  : "completed",
                        rounding: 0,
                        cashout : 0,
                        metaData: {
                            key: "value",
                        },
                        subType: "VISA",
                    },
                    {
                        method  : "sale-payment-b-id",
                        type    : undefined,
                        amount  : 14.99,
                        status  : "completed",
                        rounding: 0,
                        cashout : 0,
                        metaData: {},
                        subType : undefined,
                    },
                ],
                isCancellable: true,
            });
        });
    });
});
