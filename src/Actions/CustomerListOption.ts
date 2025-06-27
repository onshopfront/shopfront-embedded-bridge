import { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";

export class CustomerListOption extends BaseAction<CustomerListOption> {
    protected supportedEvents = [ "click" ];

    protected contents: string;

    constructor(contents: Serialized<CustomerListOption> | string) {
        super((() => {
            if(typeof contents === "string") {
                return {
                    properties: [ contents ],
                    events    : {},
                    type      : "CustomerListOption",
                };
            }

            return contents;
        })(), CustomerListOption);

        if(typeof contents === "string") {
            this.contents = contents;
        } else {
            this.contents = contents.properties[0] as string;
        }
    }
}
