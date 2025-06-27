import {
    afterEach,
    assert,
    beforeAll,
    suite,
    test,
} from "@onshopfront/core/tests";
import { SalePayment } from "../../src/APIs/Sale/SalePayment.js";
import { SaleProduct } from "../../src/APIs/Sale/SaleProduct.js";
import { MockedCurrentSale } from "../../src/Mocks/APIs/Sale/CurrentSale.js";

/**
 * Creates a blank current sale to use in tests
 */
const createBlankSale = (): MockedCurrentSale => {
    return new MockedCurrentSale({
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

let sale: MockedCurrentSale;

beforeAll(() => {
    sale = createBlankSale();
});

afterEach(async () => {
    await sale.clearSale();
});

suite("Testing the mocked `CurrentSale` class behaves properly", () => {
    suite("Products can be properly added / removed / updated", () => {
        test("When a product is added to the sale, the sale state is updated correctly", async () => {
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
        });

        test("If a product that exists in the sale is added again, the sale state is updated correctly", async () => {
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
        });

        test("When a product is removed from the sale, the sale state is updated correctly", async () => {
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
        });

        suite("When a product is updated in the sale, the sale state is updated correctly", () => {
            test("When a product's quantity is updated, the sale state is updated correctly", async () => {
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
            });

            test("When a product's price is updated, the sale state is updated correctly", async () => {
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
                assert(productAInSale.getIndexAddress()).equals([0])
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
    });

    suite("Other sale properties can be updated", () => {
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
});
