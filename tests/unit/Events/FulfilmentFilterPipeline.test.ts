import {
    assert,
    mock,
    suite,
    test,
} from "@onshopfront/core/tests";
import {
    type FulfilmentFilterPipelineContext,
    ToShopfront,
} from "../../../src/ApplicationEvents/ToShopfront.js";
import type { BaseBridge } from "../../../src/BaseBridge.js";
import { FulfilmentFilterPipeline } from "../../../src/Events/FulfilmentFilterPipeline.js";

const context: FulfilmentFilterPipelineContext = {
    availableStatuses: [ "WAITING_FOR_PACKING", "PACKED", "COLLECTED", "COMPLETED" ],
};

suite("The `FulfilmentFilterPipeline` event", () => {
    test("The callback receives the previous filter and the context", async () => {
        const callback = mock.fn(() => [ "WAITING_FOR_PACKING" as const ]);
        const event = new FulfilmentFilterPipeline(callback);

        await event.emit({
            data: [ "WAITING_FOR_PACKING", "PACKED" ],
            context,
        });

        assert(callback).wasLastCalledWith([ "WAITING_FOR_PACKING", "PACKED" ], context);
    });

    test("A valid array of statuses is returned unchanged", async () => {
        const event = new FulfilmentFilterPipeline(() => [ "PACKED", "COMPLETED" ]);

        assert(await event.emit({
            data: [ "WAITING_FOR_PACKING" ],
            context,
        })).equals([ "PACKED", "COMPLETED" ]);
    });

    test("An asynchronous callback is awaited", async () => {
        const event = new FulfilmentFilterPipeline(async () => [ "COLLECTED" ]);

        assert(await event.emit({
            data: [],
            context,
        })).equals([ "COLLECTED" ]);
    });

    test("When the callback doesn't return an array, an error is thrown", async () => {
        // @ts-expect-error Forcing an invalid return for testing
        const event = new FulfilmentFilterPipeline(() => "PACKED");

        await assert(event.emit({
            data: [],
            context,
        })).rejects(new TypeError("Callback must return an array of fulfilment order statuses"));
    });

    test("When the callback returns an unknown status, an error is thrown", async () => {
        // @ts-expect-error Forcing an invalid status for testing
        const event = new FulfilmentFilterPipeline(() => [ "PACKED", "PENDING_APPROVAL" ]);

        await assert(event.emit({
            data: [],
            context,
        })).rejects(new TypeError("Callback must return an array of fulfilment order statuses"));
    });

    test("The response is sent through the pipeline response event", async () => {
        const sendMessage = mock.fn();

        await FulfilmentFilterPipeline.respond({
            sendMessage,
        } as unknown as BaseBridge, [ "PACKED" ], "request-id");

        assert(sendMessage).wasLastCalledWith(ToShopfront.RESPONSE_UI_PIPELINE, [ "PACKED" ], "request-id");
    });
});
