export class SaleCancelledError extends Error {
    constructor() {
        super("The sale is no longer active.");
    }
}

export class InvalidSaleDeviceError extends Error {
    constructor() {
        super("This device is no longer a register able to perform a sale.");
    }
}

export class ProductNotExistsError extends Error {
    constructor() {
        super("Product does not exist in the sale");
    }
}
