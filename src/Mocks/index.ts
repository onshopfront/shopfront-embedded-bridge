import { MockCurrentSale } from "./APIs/Sale/MockCurrentSale.js";
import { MockDatabase } from "./Database/MockDatabase.js";
import { MockApplication } from "./MockApplication.js";
import { MockBridge } from "./MockBridge.js";

/**
 * Creates a mocked instance of the Embedded Application
 */
function mockApplication(id: string, vendor: string): MockApplication {
    if(typeof id === "undefined") {
        throw new TypeError("You must specify the ID for the application");
    }

    if(typeof vendor === "undefined") {
        throw new TypeError("You must specify the Vendor for the application");
    }

    return new MockApplication(new MockBridge(id, vendor));
}

export {
    MockApplication,
    mockApplication,
    MockBridge,
    MockCurrentSale,
    MockDatabase,
};
