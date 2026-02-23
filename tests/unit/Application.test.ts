import {
    assert,
    beforeAll,
    mock,
    suite,
    test,
} from "@onshopfront/core/tests";
import { noop } from "@onshopfront/core/utilities";
import type { OrderDetails } from "../../src/APIs/Fulfilment/FulfilmentTypes.js";
import { InternalMessageSource } from "../../src/APIs/InternalMessages/InternalMessageSource.js";
import type { SaleData } from "../../src/APIs/Sale/BaseSale.js";
import { Sale } from "../../src/APIs/Sale/Sale.js";
import { SaleCustomer } from "../../src/APIs/Sale/SaleCustomer.js";
import { SalePayment } from "../../src/APIs/Sale/SalePayment.js";
import { SaleProduct } from "../../src/APIs/Sale/SaleProduct.js";
import type { ShopfrontSaleState } from "../../src/APIs/Sale/ShopfrontSaleState.js";
import { Application } from "../../src/Application.js";
import { Bridge } from "../../src/Bridge.js";
import type { FormattedSaleProduct } from "../../src/Events/FormatIntegratedProduct.js";
import type { CompletedSale } from "../../src/Events/SaleComplete.js";
import { mockApplication } from "../../src/Mocks/index.js";
import { MockApplication } from "../../src/Mocks/MockApplication.js";
import type { SaleEventProduct } from "../../src/Events/DirectEvents/types/SaleEventData.js";
import UUID from "../../src/Utilities/UUID.js";

/**
 * Returns a new instance of a mocked Application
 */
const createMockedApplication = (): MockApplication => {
    return mockApplication("application-id", "testing");
};

const blankSaleData: SaleData = {
    internalId: UUID.generate(),
    products: [],
    payments: [],
    customer: null,
    totals  : {
        sale    : 0,
        paid    : 0,
        discount: 0,
        savings : 0,
    },
    clientId: "",
    register: "register-id",
    priceSet: "",
    notes   : {
        internal: "",
        sale    : "",
    },
    orderReference: "",
    linkedTo      : "",
    refundReason  : "",
    metaData      : {},
};

suite("Testing the methods of the mock `Application` class", () => {
    suite("The `mockApplication` method can return a mocked Application", () => {
        test("When `mock` is `true`, a mocked Application is returned", () => {
            const application = mockApplication("application-id", "testing");

            assert(application instanceof MockApplication);
        });

        test("When no `id` is provided, an error is thrown", () => {
            assert(
                // @ts-expect-error Forcing undefined for testing
                () => mockApplication(undefined, "testing")
            ).throws(
                new TypeError("You must specify the ID for the application")
            );
        });

        test("When no `vendor` is provided, an error is thrown", () => {
            assert(
                // @ts-expect-error Forcing undefined for testing
                () => mockApplication("application-id", undefined)
            ).throws(
                new TypeError("You must specify the Vendor for the application")
            );
        });

        test("When initialised, the Application enters a 'ready' state immediately", () => {
            const application = createMockedApplication();

            // The `isReady` flag should be `true`
            assert(application["isReady"]).equals(true);

            // The `key` property should populate with the `key` value from the data passed into the callback
            assert(application["key"]).equals("embedded-key");

            // The `outlet` property should populate with the `outlet` value from the data passed into the callback
            assert(application["outlet"]).equals("outlet-id");

            // The `register` property should populate with the `register` value from the data passed into the callback
            assert(application["register"]).equals("register-id");

            const readyCallback = mock.fn();

            // The callback should be invoked straight away as the application is already ready
            application.addEventListener("READY", readyCallback);

            assert(readyCallback.mock.calls.length).equals(1);
        });
    });

    suite("All valid events can be listened to via the `addEventListener` method", () => {
        const application = createMockedApplication();

        test("All direct events can be listened to", () => {
            application.addEventListener("SALE_ADD_PRODUCT", noop);

            assert(application["directListeners"]["SALE_ADD_PRODUCT"]?.size).equals(1);

            application.addEventListener("SALE_REMOVE_PRODUCT", noop);

            assert(application["directListeners"]["SALE_REMOVE_PRODUCT"]?.size).equals(1);

            application.addEventListener("SALE_UPDATE_PRODUCTS", noop);

            assert(application["directListeners"]["SALE_UPDATE_PRODUCTS"]?.size).equals(1);

            application.addEventListener("SALE_CHANGE_QUANTITY", noop);

            assert(application["directListeners"]["SALE_CHANGE_QUANTITY"]?.size).equals(1);

            application.addEventListener("SALE_ADD_CUSTOMER", noop);

            assert(application["directListeners"]["SALE_ADD_CUSTOMER"]?.size).equals(1);

            application.addEventListener("SALE_REMOVE_CUSTOMER", noop);

            assert(application["directListeners"]["SALE_REMOVE_CUSTOMER"]?.size).equals(1);

            application.addEventListener("SALE_CLEAR", noop);

            assert(application["directListeners"]["SALE_CLEAR"]?.size).equals(1);

        });

        test("All FromShopfront events can be listened to", () => {
            application.addEventListener("READY", noop);

            assert(application["listeners"]["READY"]?.size).equals(1);

            application.addEventListener("REQUEST_SETTINGS", () => ({
                logo       : "",
                description: "",
                url        : "",
            }));

            assert(application["listeners"]["REQUEST_SETTINGS"]?.size).equals(1);

            application.addEventListener("REQUEST_BUTTONS", () => ([]));

            assert(application["listeners"]["REQUEST_BUTTONS"]?.size).equals(1);

            application.addEventListener("REQUEST_TABLE_COLUMNS", () => ({
                headers: [],
                body   : [],
                footer : {},
            }));

            assert(application["listeners"]["REQUEST_TABLE_COLUMNS"]?.size).equals(1);

            application.addEventListener("REQUEST_SELL_SCREEN_OPTIONS", () => ([]));

            assert(application["listeners"]["REQUEST_SELL_SCREEN_OPTIONS"]?.size).equals(1);

            application.addEventListener("INTERNAL_PAGE_MESSAGE", () => undefined);

            assert(application["listeners"]["INTERNAL_PAGE_MESSAGE"]?.size).equals(1);

            application.addEventListener("REGISTER_CHANGED", () => undefined);

            // We expect two listeners because one is automatically registered when the application is created
            assert(application["listeners"]["REGISTER_CHANGED"]?.size).equals(2);

            application.addEventListener("REQUEST_CUSTOMER_LIST_OPTIONS", () => ([]));

            assert(application["listeners"]["REQUEST_CUSTOMER_LIST_OPTIONS"]?.size).equals(1);

            application.addEventListener("FORMAT_INTEGRATED_PRODUCT", () => ({
                product: {} as FormattedSaleProduct,
            }));

            assert(application["listeners"]["FORMAT_INTEGRATED_PRODUCT"]?.size).equals(1);

            application.addEventListener("REQUEST_SALE_KEYS", () => ([]));

            assert(application["listeners"]["REQUEST_SALE_KEYS"]?.size).equals(1);

            application.addEventListener("SALE_COMPLETE", noop);

            assert(application["listeners"]["SALE_COMPLETE"]?.size).equals(1);

            application.addEventListener("UI_PIPELINE", () => ([]));

            assert(application["listeners"]["UI_PIPELINE"]?.size).equals(1);

            application.addEventListener("PAYMENT_METHODS_ENABLED", () => ([]));

            assert(application["listeners"]["PAYMENT_METHODS_ENABLED"]?.size).equals(1);

            application.addEventListener("AUDIO_READY", () => undefined);

            assert(application["listeners"]["AUDIO_READY"]?.size).equals(1);

            application.addEventListener("AUDIO_PERMISSION_CHANGE", () => undefined);

            assert(application["listeners"]["AUDIO_PERMISSION_CHANGE"]?.size).equals(1);

            application.addEventListener("FULFILMENT_GET_ORDER", () => ({} as OrderDetails));

            assert(application["listeners"]["FULFILMENT_GET_ORDER"]?.size).equals(1);

            application.addEventListener("FULFILMENT_VOID_ORDER", () => undefined);

            assert(application["listeners"]["FULFILMENT_VOID_ORDER"]?.size).equals(1);

            application.addEventListener("FULFILMENT_PROCESS_ORDER", () => undefined);

            assert(application["listeners"]["FULFILMENT_PROCESS_ORDER"]?.size).equals(1);

            application.addEventListener("FULFILMENT_ORDER_APPROVAL", () => undefined);

            assert(application["listeners"]["FULFILMENT_ORDER_APPROVAL"]?.size).equals(1);

            application.addEventListener("FULFILMENT_ORDER_COLLECTED", () => undefined);

            assert(application["listeners"]["FULFILMENT_ORDER_COLLECTED"]?.size).equals(1);

            application.addEventListener("FULFILMENT_ORDER_COMPLETED", () => undefined);

            assert(application["listeners"]["FULFILMENT_ORDER_COMPLETED"]?.size).equals(1);

            application.addEventListener("GIFT_CARD_CODE_CHECK", () => ({
                code   : "",
                message: "",
            }));

            assert(application["listeners"]["GIFT_CARD_CODE_CHECK"]?.size).equals(1);
        });
    });

    suite("The `removeEventListener` method can be used to remove a listener", () => {
        test("A direct event listener can be removed", () => {
            const application = createMockedApplication();

            const callback = mock.fn();

            application.addEventListener("SALE_ADD_PRODUCT", callback);

            assert(application["directListeners"]["SALE_ADD_PRODUCT"]?.size).equals(1);

            application.removeEventListener("SALE_ADD_PRODUCT", callback);

            assert(application["directListeners"]["SALE_ADD_PRODUCT"]?.size).equals(0);
        });

        test("A FromShopfront event listener can be removed", () => {
            const application = createMockedApplication();

            const callback = mock.fn();

            application.addEventListener("READY", callback);

            assert(application["listeners"]["READY"]?.size).equals(1);

            application.removeEventListener("READY", callback);

            assert(application["listeners"]["READY"]?.size).equals(0);
        });
    });

    suite("The `fireEvent` method can be used to trigger an event", () => {
        const application = createMockedApplication();

        suite("Direct events can be triggered", () => {
            test("The `SALE_ADD_PRODUCT` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_ADD_PRODUCT", callback);

                await application.fireEvent("SALE_ADD_PRODUCT", {
                    product: {} as SaleEventProduct,
                    indexAddress: []
                });

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_REMOVE_PRODUCT` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_REMOVE_PRODUCT", callback);

                await application.fireEvent("SALE_REMOVE_PRODUCT", {
                    indexAddress: []
                });

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_UPDATE_PRODUCTS` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_UPDATE_PRODUCTS", callback);

                await application.fireEvent("SALE_UPDATE_PRODUCTS", {
                    products: []
                });

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_CHANGE_QUANTITY` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_CHANGE_QUANTITY", callback);

                await application.fireEvent("SALE_CHANGE_QUANTITY", {
                    indexAddress: [],
                    amount: 0,
                    absolute: true
                });

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_ADD_CUSTOMER` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_ADD_CUSTOMER", callback);

                await application.fireEvent("SALE_ADD_CUSTOMER", {
                    customer: {
                        uuid: ""
                    }
                });

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_REMOVE_CUSTOMER` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_REMOVE_CUSTOMER", callback);

                await application.fireEvent("SALE_REMOVE_CUSTOMER");

                assert(callback.mock.calls.length).equals(1);
            });

            test("The `SALE_CLEAR` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("SALE_CLEAR", callback);

                await application.fireEvent("SALE_CLEAR");

                assert(callback.mock.calls.length).equals(1);
            });
        });

        suite("FromShopfront events can be triggered", () => {
            test("The `READY` event can be triggered", async () => {
                const callback = mock.fn();

                application.addEventListener("READY", callback);

                await application.fireEvent("READY", {
                    outlet  : "new-outlet-id",
                    register: "new-register-id",
                    vendor  : "new-vendor-id"
                });

                // The `READY` event automatically fires when the listener is first registered
                assert(callback.mock.calls.length).equals(2);

                assert(callback).wasLastCalledWith({
                    outlet  : "new-outlet-id",
                    register: "new-register-id",
                    vendor  : "new-vendor-id"
                }, undefined); // The `READY` event passes in `undefined` to the `context` parameter
            });

            test("The `REQUEST_SETTINGS` event can be triggered", async () => {
                const callback = mock.fn(() => ({
                    logo       : "",
                    description: "",
                    url        : "",
                }));

                application.addEventListener("REQUEST_SETTINGS", callback);

                await application.fireEvent("REQUEST_SETTINGS", undefined);

                assert(callback.mock.calls.length).equals(1);

                // No parameters are passed into the callback
                assert(callback).wasLastCalledWith(undefined, undefined);
            });

            test("The `REQUEST_BUTTONS` event can be triggered", async () => {
                const callback = mock.fn(() => ([]));

                application.addEventListener("REQUEST_BUTTONS", callback);

                await application.fireEvent("REQUEST_BUTTONS", {
                    id      : "id",
                    location: "location-id",
                    context : {},
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("location-id", {});
            });

            test("The `REQUEST_TABLE_COLUMNS` event can be triggered", async () => {
                const callback = mock.fn(() => ({ headers: [], body: [], footer: {} }));

                application.addEventListener("REQUEST_TABLE_COLUMNS", callback);

                await application.fireEvent("REQUEST_TABLE_COLUMNS", { location: "location-id", context: {} });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("location-id", {});
            });

            test("The `REQUEST_SELL_SCREEN_OPTIONS` event can be triggered", async () => {
                const callback = mock.fn(() => ([{
                    url  : "https://testing.test",
                    title: "Testing",
                }]));

                application.addEventListener("REQUEST_SELL_SCREEN_OPTIONS", callback);

                await application.fireEvent("REQUEST_SELL_SCREEN_OPTIONS", undefined as never);

                assert(callback.mock.calls.length).equals(1);

                // No parameters are passed into the callback
                assert(callback).wasLastCalledWith(undefined, undefined);
            });

            test("The `INTERNAL_PAGE_MESSAGE` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("INTERNAL_PAGE_MESSAGE", callback);

                await application.fireEvent("INTERNAL_PAGE_MESSAGE", {
                    method   : "EXTERNAL_APPLICATION",
                    url      : "https://testing.test",
                    message  : {},
                    reference: new InternalMessageSource(
                        application as unknown as Application,
                        "EXTERNAL_APPLICATION",
                        "https://testing.reference"
                    ),
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    method   : "EXTERNAL_APPLICATION",
                    url      : "https://testing.test",
                    message  : {},
                    reference: new InternalMessageSource(
                        application as unknown as Application,
                        "EXTERNAL_APPLICATION",
                        "https://testing.test"
                    ),
                }, undefined);
            });

            test("The `REGISTER_CHANGED` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("REGISTER_CHANGED", callback);

                await application.fireEvent("REGISTER_CHANGED", {
                    outlet  : "outlet-id",
                    register: "register-id",
                    user    : "user-id",
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    outlet  : "outlet-id",
                    register: "register-id",
                    user    : "user-id",
                }, undefined);
            });

            test("The `FORMAT_INTEGRATED_PRODUCT` event can be triggered", async () => {
                const callback = mock.fn(() => ({
                    product: {} as FormattedSaleProduct,
                }));

                application.addEventListener("FORMAT_INTEGRATED_PRODUCT", callback);

                await application.fireEvent("FORMAT_INTEGRATED_PRODUCT", {
                    data: {
                        product: {} as FormattedSaleProduct,
                    },
                    context: {},
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    product: {} as FormattedSaleProduct,
                }, {});
            });

            test("The `REQUEST_CUSTOMER_LIST_OPTIONS` event can be triggered", async () => {
                const callback = mock.fn(() => ([]));

                application.addEventListener("REQUEST_CUSTOMER_LIST_OPTIONS", callback);

                await application.fireEvent("REQUEST_CUSTOMER_LIST_OPTIONS", undefined as never);

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith(undefined, undefined);
            });

            test("The `SALE_COMPLETE` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                const completedSale: CompletedSale = {
                    id        : "",
                    userId    : "",
                    registerId: "",
                    status    : "COMPLETED",
                    products  : [],
                    payments  : [],
                    customer  : false,
                    totals    : {
                        sale     : 0,
                        paid     : 0,
                        savings  : 0,
                        discount : 0,
                        rounding : 0,
                        cashout  : 0,
                        change   : 0,
                        remaining: 0,
                    },
                    orderReference: "",
                    refundReason  : "",
                    notes         : {
                        sale    : "",
                        internal: "",
                    },
                    invoiceId: "",
                    createdAt: "",
                    metaData : {},
                };

                application.addEventListener("SALE_COMPLETE", callback);

                await application.fireEvent("SALE_COMPLETE", completedSale);

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith(completedSale, undefined);
            });

            test("The `REQUEST_SALE_KEYS` event can be triggered", async () => {
                const callback = mock.fn(() => ([]));

                application.addEventListener("REQUEST_SALE_KEYS", callback);

                await application.fireEvent("REQUEST_SALE_KEYS");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith(undefined, undefined);
            });

            test("The `UI_PIPELINE` event can be triggered", async () => {
                const callback = mock.fn((..._params) => ([]));

                application.addEventListener("UI_PIPELINE", callback);

                await application.fireEvent("UI_PIPELINE", {
                    pipelineId: "",
                    context   : {
                        location: "location-id",
                    },
                    data: [],
                }, {} as Bridge);

                assert(callback.mock.calls.length).equals(1);

                assert(callback.mock.calls[0][0]).equals([]);

                // Because of how we need to check for the trigger, we'll also check location in the same way
                assert("location" in callback.mock.calls[0][1]);
                assert(callback.mock.calls[0][1].location).equals("location-id");

                // No real easy way to check for equivalence with the trigger, so as long as it exists we're good
                assert("trigger" in callback.mock.calls[0][1]);
            });

            test("The `PAYMENT_METHODS_ENABLED` event can be triggered", async () => {
                const callback = mock.fn(() => ([]));

                application.addEventListener("PAYMENT_METHODS_ENABLED", callback);

                await application.fireEvent("PAYMENT_METHODS_ENABLED", {
                    data   : [],
                    context: {
                        register: "",
                        customer: false,
                    },
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith([], {
                    register: "",
                    customer: false,
                });
            });

            test("The `AUDIO_READY` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("AUDIO_READY", callback);

                await application.fireEvent("AUDIO_READY");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith(undefined, undefined);
            });

            test("The `AUDIO_PERMISSION_CHANGE` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("AUDIO_PERMISSION_CHANGE", callback);

                await application.fireEvent("AUDIO_PERMISSION_CHANGE", { permitted: true });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({ permitted: true }, undefined);
            });

            test("The `FULFILMENT_GET_ORDER` event can be triggered", async () => {
                const callback = mock.fn(() => ({} as OrderDetails));

                application.addEventListener("FULFILMENT_GET_ORDER", callback);

                await application.fireEvent("FULFILMENT_GET_ORDER", "order-id");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("order-id", undefined);
            });

            test("The `FULFILMENT_VOID_ORDER` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("FULFILMENT_VOID_ORDER", callback);

                await application.fireEvent("FULFILMENT_VOID_ORDER", "order-id");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("order-id", undefined);
            });

            test("The `FULFILMENT_PROCESS_ORDER` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                const sale: ShopfrontSaleState = {
                    internalId: UUID.generate(),
                    products: [],
                    payments: [],
                    customer: false,
                    totals  : {
                        sale    : 0,
                        paid    : 0,
                        savings : 0,
                        discount: 0,
                    },
                    orderReference: "",
                    refundReason  : "",
                    notes         : {
                        sale    : "",
                        internal: "",
                    },
                    linkedTo: "",
                    priceSet: "",
                    metaData: {},
                };

                application.addEventListener("FULFILMENT_PROCESS_ORDER", callback);

                await application.fireEvent("FULFILMENT_PROCESS_ORDER", {
                    id: "order-id",
                    sale,
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    id  : "order-id",
                    sale: new Sale(Sale.buildSaleData(sale)),
                }, undefined);
            });

            test("The `FULFILMENT_ORDER_APPROVAL` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("FULFILMENT_ORDER_APPROVAL", callback);

                await application.fireEvent("FULFILMENT_ORDER_APPROVAL", {
                    id      : "order-id",
                    approved: true,
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    id      : "order-id",
                    approved: true,
                }, undefined);
            });

            test("The `FULFILMENT_ORDER_COMPLETED` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("FULFILMENT_ORDER_COMPLETED", callback);

                await application.fireEvent("FULFILMENT_ORDER_COMPLETED", "order-id");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("order-id", undefined);
            });

            test("The `FULFILMENT_ORDER_COLLECTED` event can be triggered", async () => {
                const callback = mock.fn(() => undefined);

                application.addEventListener("FULFILMENT_ORDER_COLLECTED", callback);

                await application.fireEvent("FULFILMENT_ORDER_COLLECTED", "order-id");

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith("order-id", undefined);
            });

            test("The `GIFT_CARD_CODE_CHECK` event can be triggered", async () => {
                const callback = mock.fn(() => ({
                    code   : "",
                    message: "",
                }));

                application.addEventListener("GIFT_CARD_CODE_CHECK", callback);

                await application.fireEvent("GIFT_CARD_CODE_CHECK", {
                    data: {
                        code   : "1234",
                        message: "Message",
                    },
                });

                assert(callback.mock.calls.length).equals(1);

                assert(callback).wasLastCalledWith({
                    code   : "1234",
                    message: "Message",
                }, undefined);
            });
        });
    });

    suite("The `createSale` method correctly mocks a sale creation", () => {
        let application: MockApplication;

        beforeAll(async () => {
            application = createMockedApplication();

            await application.fireEvent("REGISTER_CHANGED", {
                outlet  : "outlet-id",
                register: "register-id",
                user    : "user-id",
            });
        })

        test("If valid sale data is provided, method returns a successful response", async () => {
            const sale = new Sale(blankSaleData);

            const response = await application.createSale(sale);

            assert(response.success).equals(true);
            assert(response.message).not.isDefined();
        });

        test("If a register isn't provided, and one doesn't exist on the application, an error is thrown", async () => {
            const sale = new Sale({
                ...blankSaleData,
                register: "",
            });

            application["register"] = null;

            const response = await application.createSale(sale);

            assert(response.success).equals(false);
            assert(response.message).equals(
                "Sale has not provided a register and Shopfront currently doesn't have a register selected."
            );

            application["register"] = "register-id";
        });

        test("If a user doesn't exist on the application, an error is thrown", async () => {
            const sale = new Sale(blankSaleData);

            application["user"] = null;

            const response = await application.createSale(sale);

            assert(response.success).equals(false);
            assert(response.message).equals(
                "A sale cannot be created when there is no user logged in to Shopfront."
            );

            application["user"] = "user-id";
        });

        test("If a payment method specifies cashout, an error is thrown", async () => {
            const sale = new Sale({
                ...blankSaleData,
                payments: [ new SalePayment("payment-id", 10, 10) ],
            });

            const response = await application.createSale(sale);

            assert(response.success).equals(false);
            assert(response.message).equals(
                "Sale payment with cash out is currently unsupported " +
                "through the Embedded Fulfilment API."
            );
        });

        test("If a payment method specifies rounding, an error is thrown", async () => {
            const payment = new SalePayment("payment-id", 10);

            payment["rounding"] = 0.49;

            const sale = new Sale({
                ...blankSaleData,
                payments: [ payment ],
            });

            const response = await application.createSale(sale);

            assert(response.success).equals(false);
            assert(response.message).equals(
                "Sale payment with rounding is currently unsupported " +
                "through the Embedded Fulfilment API."
            );
        });

        test("If the payment amount is greater than the sale total, an error is thrown", async () => {
            const sale = new Sale({
                ...blankSaleData,
                payments: [ new SalePayment("payment-id", 10) ],
            });

            const response = await application.createSale(sale);

            assert(response.success).equals(false);
            assert(response.message).equals("Total paid is greater than sale total.");
        });
    });

    suite("When modifying the current sale, the current event listeners are fired", () => {
        const application = createMockedApplication();

        test("When a product is added, the `SALE_ADD_PRODUCT` event is fired", async () => {
            const sale = await application.getCurrentSale();

            if(!sale) {
                assert.fail("Unable to get current sale");

                return;
            }

            const callback = mock.fn();

            application.addEventListener("SALE_ADD_PRODUCT", callback);

            await sale.addProduct(new SaleProduct("product-id", 10, 10));

            assert(callback.mock.calls.length).equals(1);

            sale.clearSale();
        });

        test("When a product is removed, the `SALE_REMOVE_PRODUCT` event is fired", async () => {
            const sale = await application.getCurrentSale();

            if(!sale) {
                assert.fail("Unable to get current sale");

                return;
            }

            const callback = mock.fn();

            application.addEventListener("SALE_REMOVE_PRODUCT", callback);

            await sale.addProduct(new SaleProduct("product-id", 10, 10));
            await sale.removeProduct(new SaleProduct("product-id", 10, 10));

            assert(callback.mock.calls.length).equals(1);
        });

        test("When a product is updated, the `SALE_UPDATE_PRODUCT` event is fired", async () => {
            const sale = await application.getCurrentSale();

            if(!sale) {
                assert.fail("Unable to get current sale");

                return;
            }

            const callback = mock.fn();

            application.addEventListener("SALE_UPDATE_PRODUCTS", callback);

            await sale.addProduct(new SaleProduct("product-id", 10, 10));

            await sale.updateProduct(new SaleProduct("product-id", 20, 10));

            // Adding a product is considered updating, so we'll have two events fired
            assert(callback.mock.calls.length).equals(2);
        });

        test("When a customer is added, the `SALE_ADD_CUSTOMER` event is fired", async () => {
            const sale = await application.getCurrentSale();

            if(!sale) {
                assert.fail("Unable to get current sale");

                return;
            }

            const callback = mock.fn();

            application.addEventListener("SALE_ADD_CUSTOMER", callback);

            await sale.addCustomer(new SaleCustomer("customer-id"));

            assert(callback.mock.calls.length).equals(1);
        });

        test("When a customer is removed, the `SALE_REMOVE_CUSTOMER` event is fired", async () => {
            const sale = await application.getCurrentSale();

            if(!sale) {
                assert.fail("Unable to get current sale");

                return;
            }

            const callback = mock.fn();

            application.addEventListener("SALE_REMOVE_CUSTOMER", callback);

            await sale.removeCustomer();

            assert(callback.mock.calls.length).equals(1);
        });
    });
});
