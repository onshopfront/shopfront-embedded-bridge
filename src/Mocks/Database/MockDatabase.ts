import {
    BaseDatabase,
    DatabaseCallReturn,
    DatabaseMethodName,
    DatabaseTable,
} from "../../APIs/Database/BaseDatabase.js";
import { LocalDatabaseBarcodeTemplate } from "../../APIs/Database/types/BaseBarcodeTemplateRepository.js";
import { LocalDatabaseClassification } from "../../APIs/Database/types/BaseClassificationRepository.js";
import { LocalDatabaseCustomerDisplay } from "../../APIs/Database/types/BaseCustomerDisplayRepository.js";
import { LocalDatabaseCustomerGroup } from "../../APIs/Database/types/BaseCustomerGroupRepository.js";
import { LocalDatabaseCustomer } from "../../APIs/Database/types/BaseCustomerRepository.js";
import { LocalDatabaseEnterprise } from "../../APIs/Database/types/BaseEnterpriseRepository.js";
import { LocalDatabaseGiftCard } from "../../APIs/Database/types/BaseGiftCardRepository.js";
import { LocalDatabaseLoyalty } from "../../APIs/Database/types/BaseLoyaltyRepository.js";
import { LocalDatabaseMovement } from "../../APIs/Database/types/BaseMovementRepository.js";
import { LocalDatabaseOutlet } from "../../APIs/Database/types/BaseOutletRepository.js";
import { LocalDatabasePaymentMethod } from "../../APIs/Database/types/BasePaymentMethodRepository.js";
import { LocalDatabasePriceList } from "../../APIs/Database/types/BasePriceListRepository.js";
import { LocalDatabasePriceSet } from "../../APIs/Database/types/BasePriceSetRepository.js";
import { LocalDatabaseProduct } from "../../APIs/Database/types/BaseProductRepository.js";
import { LocalDatabasePromotionCategory } from "../../APIs/Database/types/BasePromotionCategoryRepository.js";
import { LocalDatabasePromotion } from "../../APIs/Database/types/BasePromotionRepository.js";
import { LocalDatabaseReceipt } from "../../APIs/Database/types/BaseReceiptRepository.js";
import { LocalDatabaseRegister } from "../../APIs/Database/types/BaseRegisterRepository.js";
import { LocalDatabaseSaleKeys } from "../../APIs/Database/types/BaseSalesKeyRepository.js";
import { LocalDatabaseSale } from "../../APIs/Database/types/BaseSalesRepository.js";
import { LocalDatabaseStocktakeAccumulated } from "../../APIs/Database/types/BaseStocktakeAccumulatedRepository.js";
import { LocalDatabaseStocktake } from "../../APIs/Database/types/BaseStocktakeRepository.js";
import { LocalDatabaseStocktakeScanned } from "../../APIs/Database/types/BaseStocktakeScannedRepository.js";
import { LocalDatabaseSupplier } from "../../APIs/Database/types/BaseSupplierRepository.js";
import { LocalDatabaseTakings } from "../../APIs/Database/types/BaseTakingsRepository.js";
import { LocalDatabaseTaxRate } from "../../APIs/Database/types/BaseTaxRateRepository.js";
import { LocalDatabaseTransferee } from "../../APIs/Database/types/BaseTransfereeRepository.js";
import { LocalDatabaseVendorConnection } from "../../APIs/Database/types/BaseVendorConnectionRepository.js";
import { MockBridge } from "../MockBridge.js";

interface MockedDatabase {
    products: Array<LocalDatabaseProduct>;
    customers: Array<LocalDatabaseCustomer>;
    customerGroups: Array<LocalDatabaseCustomerGroup>;
    promotions: Array<LocalDatabasePromotion>;
    promotionCategories: Array<LocalDatabasePromotionCategory>;
    priceLists: Array<LocalDatabasePriceList>;
    paymentMethods: Array<LocalDatabasePaymentMethod>;
    salesKeys: Array<LocalDatabaseSaleKeys>;
    receipts: Array<LocalDatabaseReceipt>;
    giftCards: Array<LocalDatabaseGiftCard>;
    loyalty: Array<LocalDatabaseLoyalty>;
    customerDisplays: Array<LocalDatabaseCustomerDisplay>;
    sales: Array<LocalDatabaseSale>;
    brands: Array<LocalDatabaseClassification>;
    categories: Array<LocalDatabaseClassification>;
    families: Array<LocalDatabaseClassification>;
    tags: Array<LocalDatabaseClassification>;
    outlets: Array<LocalDatabaseOutlet>;
    registers: Array<LocalDatabaseRegister>;
    taxRates: Array<LocalDatabaseTaxRate>;
    takings: Array<LocalDatabaseTakings>;
    suppliers: Array<LocalDatabaseSupplier>;
    priceSets: Array<LocalDatabasePriceSet>;
    transferees: Array<LocalDatabaseTransferee>;
    movements: Array<LocalDatabaseMovement>;
    stocktakes: Array<LocalDatabaseStocktake>;
    stocktakeScanned: Array<LocalDatabaseStocktakeScanned>;
    stocktakeAccumulated: Array<LocalDatabaseStocktakeAccumulated>;
    barcodeTemplates: Array<LocalDatabaseBarcodeTemplate>;
    vendorConnections: Array<LocalDatabaseVendorConnection>;
    enterprises: Array<LocalDatabaseEnterprise>;
}

const emptyDatabase: MockedDatabase = {
    products            : [],
    customers           : [],
    customerGroups      : [],
    promotions          : [],
    promotionCategories : [],
    priceLists          : [],
    paymentMethods      : [],
    salesKeys           : [],
    receipts            : [],
    giftCards           : [],
    loyalty             : [],
    customerDisplays    : [],
    sales               : [],
    brands              : [],
    categories          : [],
    families            : [],
    tags                : [],
    outlets             : [],
    registers           : [],
    taxRates            : [],
    takings             : [],
    suppliers           : [],
    priceSets           : [],
    transferees         : [],
    movements           : [],
    stocktakes          : [],
    stocktakeScanned    : [],
    stocktakeAccumulated: [],
    barcodeTemplates    : [],
    vendorConnections   : [],
    enterprises         : [],
};

export class MockDatabase extends BaseDatabase<MockBridge> {
    protected mockedDatabase: MockedDatabase = emptyDatabase;

    constructor(bridge: MockBridge) {
        super(bridge);
    }

    /**
     * @inheritDoc
     */
    public async callMethod<
        Table extends DatabaseTable,
        Method extends keyof DatabaseMethodName<Table>,
        ExpectedResult extends DatabaseCallReturn<Table, Method>
    >(
        table: Table,
        method: Method,
        args: Array<unknown>
    ): Promise<ExpectedResult> {
        return {} as ExpectedResult;
    }

    /**
     * @inheritDoc
     */
    public async all<Table extends DatabaseTable>(table: Table): Promise<DatabaseCallReturn<Table, "all">> {
        return [] as DatabaseCallReturn<Table, "all">;
    }

    /**
     * @inheritDoc
     */
    public async get<Table extends DatabaseTable>(
        table: Table,
        id: string | number
    ): Promise<DatabaseCallReturn<Table, "get">> {
        return {} as DatabaseCallReturn<Table, "get">;
    }

    /**
     * @inheritDoc
     */
    public async count(table: DatabaseTable): Promise<number> {
        return 0;
    }

    /**
     * Insert data into the mocked Database
     */
    public insertData<Table extends keyof MockedDatabase>(
        table: Table,
        rows: Array<MockedDatabase[Table]>
    ): void {
        if(typeof this.mockedDatabase[table] === "undefined") {
            throw new Error(`The table ${table} does not exist`);
        }

        // @ts-expect-error TypeScript resolves `MockedDatabase[Table]` as a union of arrays
        this.mockedDatabase[table].push(...rows);
    }

    /**
     * Clears all data from the mocked database
     */
    public clearDatabase(): void {
        this.mockedDatabase = emptyDatabase;
    }

    /**
     * Clears the data from a specified table
     */
    public clearTable<Table extends keyof MockedDatabase>(table: Table): void {
        if(typeof this.mockedDatabase[table] === "undefined") {
            throw new Error(`The table ${table} does not exist`);
        }

        this.mockedDatabase[table] = [];
    }
}
