import {
    afterEach,
    assert,
    beforeAll,
    mock,
    suite,
    test,
} from "@onshopfront/core/tests";
import { SaleCancelledError } from "../../src/APIs/Sale/Exceptions.js";
import { SaleCustomer } from "../../src/APIs/Sale/SaleCustomer.js";
import { SalePayment } from "../../src/APIs/Sale/SalePayment.js";
import { SaleProduct } from "../../src/APIs/Sale/SaleProduct.js";
import { MockCurrentSale } from "../../src/Mocks/APIs/Sale/MockCurrentSale.js";
import { MockApplication, mockApplication } from "../../src/Mocks/index.js";

/**
 * Creates a new Application instance to use in tests
 */
const createApplication = (): MockApplication => {
    return mockApplication("application-id", "testing");
};

let application: MockApplication;

/**
 * Creates a blank current sale to use in tests
 */
const createBlankSale = (application: MockApplication): MockCurrentSale => {
    return new MockCurrentSale(application, {
        products: [],
        payments: [],
        totals  : {
            sale    : 0,
            paid    : 0,
            discount: 0,
            savings : 0,
        },
        customer      : false,
        linkedTo      : "",
        metaData      : {},
        refundReason  : "",
        priceSet      : null,
        orderReference: "",
        notes         : {
            internal: "",
            sale    : "",
        },
    });
};

let sale: MockCurrentSale;

beforeAll(() => {
    application = createApplication();
    sale = createBlankSale(application);
});

afterEach(async () => {
    sale.clearSale();
});

suite("Testing the mocked `CurrentSale` class behaves properly", () => {
    suite("Products can be properly added / removed / updated", () => {
        test("When a product is added to the sale, the sale state is updated correctly", async () => {
            const callback = mock.fn();

            application.addEventListener("SALE_ADD_PRODUCT", () => {
                callback();
            });

            const product = new SaleProduct("product-id", 1, 24.99);

            await sale.addProduct(product);

            const productInSale = sale.getProducts().find(product => product.getId() === product.getId());

            if(!productInSale) {
                assert.fail("Could not find product in sale");

                return;
            }

            assert(productInSale.getQuantity()).equals(1);
            assert(productInSale.getPrice()).equals(24.99);
            assert(productInSale.getIndexAddress()).equals([ 0 ]);

            assert(sale.getSaleTotal()).equals(24.99);
            assert(sale.getPaidTotal()).equals(0);
            assert(sale.getDiscountTotal()).equals(0);
            assert(sale.getSavingsTotal()).equals(0);

            assert(sale.getProducts()).equals([ product ]);
            assert(sale.getPayments()).equals([]);

            assert(callback.mock.calls.length).equals(1);
        });

        test("If a product that exists in the sale is added again, the sale state is updated correctly", async () => {
            const callback = mock.fn();

            application.addEventListener("SALE_UPDATE_PRODUCTS", () => {
                callback();
            });

            const product = new SaleProduct("product-id", 1, 24.99);

            await sale.addProduct(product);

            const productInSale = sale.getProducts().find(product => product.getId() === product.getId());

            if(!productInSale) {
                assert.fail("Could not find product in sale");

                return;
            }

            assert(productInSale.getQuantity()).equals(1);
            assert(productInSale.getPrice()).equals(24.99);
            assert(productInSale.getIndexAddress()).equals([ 0 ]);

            assert(sale.getSaleTotal()).equals(24.99);

            const duplicateProduct = new SaleProduct("product-id", 1, 25.99);

            await sale.addProduct(duplicateProduct);

            // The price change should be ignored (the original price should be used)
            assert(productInSale.getQuantity()).equals(2);
            assert(productInSale.getPrice()).equals(49.98);

            assert(sale.getSaleTotal()).equals(49.98);

            assert(sale.getProducts()).equals([ productInSale ]);

            // The initial adding of the product will also trigger the callback
            assert(callback.mock.calls.length).equals(2);
        });

        test("When a product is removed from the sale, the sale state is updated correctly", async () => {
            const callback = mock.fn();

            application.addEventListener("SALE_REMOVE_PRODUCT", () => {
                callback();
            });

            const productA = new SaleProduct("product-a-id", 1, 24.99);
            const productB = new SaleProduct("product-b-id", 2, 41.98);

            await sale.addProduct(productA);
            await sale.addProduct(productB);

            const productAInSale = sale.getProducts().find(product => product.getId() === productA.getId());
            const productBInSale = sale.getProducts().find(product => product.getId() === productB.getId());

            if(!productAInSale || !productBInSale) {
                assert.fail("Could not find products in sale");

                return;
            }

            assert(productAInSale.getQuantity()).equals(1);
            assert(productAInSale.getPrice()).equals(24.99);
            assert(productAInSale.getIndexAddress()).equals([ 0 ]);

            assert(productBInSale.getQuantity()).equals(2);
            assert(productBInSale.getPrice()).equals(41.98);
            assert(productBInSale.getIndexAddress()).equals([ 1 ]);

            assert(sale.getSaleTotal()).equals(66.97);

            await sale.removeProduct(productA);

            assert(sale.getSaleTotal()).equals(41.98);
            assert(sale.getProducts()).equals([ productBInSale ]);
            // The product's index address should update
            assert(productBInSale.getIndexAddress()).equals([ 0 ]);

            assert(callback.mock.calls.length).equals(1);
        });

        suite("When a product is updated in the sale, the sale state is updated correctly", () => {
            test("When a product's quantity is updated, the sale state is updated correctly", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_UPDATE_PRODUCTS", () => {
                    callback();
                });

                const productA = new SaleProduct("product-a-id", 1, 24.99);
                const productB = new SaleProduct("product-b-id", 2, 41.98);

                await sale.addProduct(productA);
                await sale.addProduct(productB);

                assert(sale.getSaleTotal()).equals(66.97);

                productA.setQuantity(3);

                await sale.updateProduct(productA);

                // Sale Total = 24.99 * 3 + 41.98 = 116.95
                assert(sale.getSaleTotal()).equals(116.95);

                // The product in the sale should have its values properly updated
                const updatedProductA = sale.getProducts().find(product => product.getId() === productA.getId());

                if(!updatedProductA) {
                    assert.fail("Could not find updated product");

                    return;
                }

                assert(updatedProductA.getQuantity()).equals(3);
                assert(updatedProductA.getPrice()).equals(74.97);
                assert(updatedProductA.getIndexAddress()).equals([ 0 ]);

                // Product A & B being added will trigger the callback, as well as the actual `updateProduct` call
                assert(callback.mock.calls.length).equals(3);
            });

            test("When a product's price is updated, the sale state is updated correctly", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_UPDATE_PRODUCTS", () => {
                    callback();
                });

                const productA = new SaleProduct("product-a-id", 1, 34.99);
                const productB = new SaleProduct("product-b-id", 2, 12.98);

                await sale.addProduct(productA);
                await sale.addProduct(productB);

                assert(sale.getSaleTotal()).equals(47.97);

                productA.setPrice(30.99);

                await sale.updateProduct(productA);

                // Sale Total = 30.99 + 12.98 = 43.97
                assert(sale.getSaleTotal()).equals(43.97);

                // The product in the sale should have its values properly updated
                const updatedProductA = sale.getProducts().find(product => product.getId() === productA.getId());

                if(!updatedProductA) {
                    assert.fail("Could not find updated product");

                    return;
                }

                assert(updatedProductA.getQuantity()).equals(1);
                assert(updatedProductA.getPrice()).equals(30.99);
                assert(updatedProductA.getIndexAddress()).equals([ 0 ]);

                // Product A & B being added will trigger the callback, as well as the actual `updateProduct` call
                assert(callback.mock.calls.length).equals(3);
            });

            test("When a product's metadata is updated, the sale state is updated correctly", async () => {
                const productA = new SaleProduct("product-a-id", 1, 19.99);

                await sale.addProduct(productA);

                const productAInSale = sale.getProducts().find(product => product.getId() === productA.getId());

                if(!productAInSale) {
                    assert.fail("Could not find product in sale");

                    return;
                }

                assert(productAInSale.getMetaData()).equals({});

                productA.setMetaData("prop", "value");

                await sale.updateProduct(productA);

                assert(productAInSale.getMetaData()).equals({ prop: "value" });
                assert(productAInSale.getIndexAddress()).equals([ 0 ]);
            });
        });
    });

    suite("Payments can be properly added / reversed", () => {
        test("When a payment is added to the sale, the sale state is updated correctly", async () => {
            const product = new SaleProduct("product-id", 1, 24.99);
            const payment = new SalePayment("payment-id", 12.99);

            await sale.addProduct(product);
            await sale.addPayment(payment);

            assert(sale.getSaleTotal()).equals(24.99);
            assert(sale.getPaidTotal()).equals(12.99);
            assert(sale.getDiscountTotal()).equals(0);
            assert(sale.getSavingsTotal()).equals(0);

            assert(sale.getProducts()).equals([ product ]);
            assert(sale.getPayments()).equals([ payment ]);
        });

        test("When a payment is reversed, the sale state is updated correctly", async () => {
            const product = new SaleProduct("product-id", 1, 24.99);
            const payment = new SalePayment("payment-id", 12.99);

            await sale.addProduct(product);
            await sale.addPayment(payment);

            assert(sale.getPaidTotal()).equals(12.99);
            assert(sale.getPayments()).equals([ payment ]);

            await sale.reversePayment(payment);

            assert(sale.getPaidTotal()).equals(0);
            assert(sale.getPayments()).equals([
                payment,
                new SalePayment("payment-id", -12.99),
            ]);
        });

        test("A payment cannot be reversed if it would bring the paid total below 0", async () => {
            const product = new SaleProduct("product-id", 1, 24.99);
            const payment = new SalePayment("payment-id", 12.99);

            await sale.addProduct(product);
            await sale.addPayment(payment);

            assert(sale.getPaidTotal()).equals(12.99);
            assert(sale.getPayments()).equals([ payment ]);

            await assert(
                sale.reversePayment(new SalePayment("payment-id", 24.99))
            ).rejects();
        });

        test("When the remaining total is less than 0, the sale auto-completes", async () => {
            const callback = mock.fn();

            application.addEventListener("SALE_CLEAR", () => {
                callback();
            });

            const product = new SaleProduct("product-id", 1, 24.99);
            const payment = new SalePayment("payment-id", 24.99);

            await sale.addProduct(product);
            await sale.addPayment(payment);

            assert(sale.getSaleTotal()).equals(0);
            assert(sale.getPaidTotal()).equals(0);
            assert(sale.getDiscountTotal()).equals(0);
            assert(sale.getSavingsTotal()).equals(0);

            assert(sale.getProducts()).equals([]);
            assert(sale.getPayments()).equals([]);

            assert(sale.getClientId()).not.isDefined();
            assert(sale.getRegister()).not.isDefined();
            assert(sale.getCustomer()).equals(null);
            assert(sale.getInternalNote()).equals("");
            assert(sale.getExternalNote()).equals("");
            assert(sale.getLinkedTo()).equals("");
            assert(sale.getOrderReference()).equals("");
            assert(sale.getRefundReason()).equals("");
            assert(sale.getPriceSet()).equals(null);
            assert(sale.getMetaData()).equals({});

            assert(callback.mock.calls.length).equals(1);
        });
    });

    suite("Other sale properties can be updated", () => {
        suite("A customer can be added / removed", () => {
            test("A customer can be added to the sale", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_ADD_CUSTOMER", () => {
                    callback();
                });

                const customer = new SaleCustomer("customer-id");

                await sale.addCustomer(customer);

                assert(sale.getCustomer()).equals(customer);

                assert(callback.mock.calls.length).equals(1);
            });

            test("A customer can be removed from the sale", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_REMOVE_CUSTOMER", () => {
                    callback();
                });

                const customer = new SaleCustomer("customer-id");

                await sale.addCustomer(customer);
                await sale.removeCustomer();

                assert(sale.getCustomer()).equals(null);

                assert(callback.mock.calls.length).equals(1);
            });
        });

        test("An external note can be added to the sale", async () => {
            await sale.setExternalNote("This is an external note");

            assert(sale.getExternalNote()).equals("This is an external note");
        });

        test("An internal note can be added to the sale", async () => {
            await sale.setInternalNote("This is an internal note");

            assert(sale.getInternalNote()).equals("This is an internal note");
        });

        test("An order reference can be added to the sale", async () => {
            await sale.setOrderReference("XXXXYYYY");

            await sale.refreshSale();

            assert(sale.getOrderReference()).equals("XXXXYYYY");
        });

        test("Metadata can be added to the sale", async () => {
            await sale.setMetaData({ prop: "value" });

            assert(sale.getMetaData()).equals({ prop: "value" });
        });
    });

    suite("A cancelled sale is handled correctly", () => {
        test("The sale can be cancelled", async () => {
            await sale.cancelSale();

            assert(sale["cancelled"]).equals(true);
        });

        test("If the sale is cancelled, it cannot be interacted with", async () => {
            await sale.cancelSale();

            await assert(
                sale.addProduct(new SaleProduct("product-id", 1, 24.99))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.removeProduct(new SaleProduct("product-id", 1, 24.99))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.updateProduct(new SaleProduct("product-id", 1, 24.99))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.addPayment(new SalePayment("payment-id", 24.99))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.reversePayment(new SalePayment("payment-id", 24.99))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.addCustomer(new SaleCustomer("customer-id"))
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.removeCustomer()
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.setExternalNote("This is an external note")
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.setInternalNote("This is an internal note")
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.setOrderReference("XXXXXX")
            ).rejects(
                new SaleCancelledError()
            );

            await assert(
                sale.setMetaData({})
            ).rejects(
                new SaleCancelledError()
            );
        });
    });

});
