import BaseRepository from "./BaseRepository.js";

export type SaleKeyActionType =
    "add-single" |
    "add-case" |
    "add-giftcard" |
    "product-details" |
    "case" |
    "open-drawer" |
    "add-note" |
    "create-customer" |
    "return-item" |
    "flip-sale" |
    "pay-exact" |
    "pay-amount" |
    "view-promotions" |
    "sale-search" |
    "cancel-sale" |
    "add-product" |
    "subtract-product" |
    "add-product-barcode" |
    "subtract-product-barcode" |
    "open-folder" |
    "previous-folder" |
    "display-classification" |
    "keyboard" |
    "reweigh" |
    "customer-list" |
    "live-profit" |
    "current-time" |
    "previous-date" |
    "add-component" |
    "remove-component" |
    "display-classification-case" |
    "change-price-set" |
    "add-customer" |
    "make-customer-payment" |
    "apply-discount" |
    "add-component-to-current" |
    "remove-component-from-current" |
    "add-order-reference" |
    "search-additional" |
    "show-backorders" |
    "pay-loyalty";

// Note: Actions from the embedded api is the reason for the string union
export type SaleKeyActionUnion = SaleKeyActionType | "noop" | string;

export interface SaleKeyType {
    action: SaleKeyActionUnion;
    actionargs: Record<string, unknown>;
    background: string;
    backgroundhover: string;
    bordercolour: string;
    constrainheight: boolean;
    constrainwidth: boolean;
    disabled: boolean;
    fill: boolean;
    hover: boolean;
    hoveranimation: boolean;
    image: string | null;
    imagehover: string | null;
    preventdisable: boolean;
    text: string;
    textcolour: string;
    texthover: string;
    texthovercolour: string;
    top: number;
    left: number;
    width: number;
    height: number;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export interface LocalDatabaseSaleKeys {
    keys: Array<SaleKeyType>;
    name: string;
    uuid: string;
}

export type BaseSalesKeyRepository = BaseRepository<LocalDatabaseSaleKeys>;
