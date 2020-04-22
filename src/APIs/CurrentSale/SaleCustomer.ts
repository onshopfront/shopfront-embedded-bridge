export class SaleCustomer {
    protected id: string;

    constructor(id: string) {
        this.id = id;
    }

    /**
     * Get the ID of the customer.
     *
     * @returns {string}
     */
    getId() {
        return this.id;
    }
}
