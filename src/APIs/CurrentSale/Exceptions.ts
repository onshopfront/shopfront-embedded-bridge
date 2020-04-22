class SaleCancelledError extends Error {
    constructor() {
        super("The sale is no longer active.");
    }
}

class InvalidSaleDeviceError extends Error {
    constructor() {
        super("This device is no longer a register able to perform a sale.");
    }
}
