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

    suite("When the callback fails, the statuses are passed through unchanged and an error is logged", () => {
        const expectPassThrough = async (callback: (statuses?: unknown) => unknown) => {
            const originalError = console.error;
            const consoleError = mock.fn();

            console.error = consoleError;

            // @ts-expect-error Forcing an invalid callback for testing
            const event = new FulfilmentFilterPipeline(callback);

            assert(await event.emit({
                data: [ "WAITING_FOR_PACKING", "PACKED" ],
                context,
            })).equals([ "WAITING_FOR_PACKING", "PACKED" ]);

            assert(consoleError.mock.calls.length).equals(1);

            console.error = originalError;
        };

        test("A result that isn't an array", () => expectPassThrough(() => "PACKED"));

        test("An empty array", () => expectPassThrough(() => []));

        test("An unknown status", () => expectPassThrough(() => [ "PACKED", "PENDING_APPROVAL" ]));

        test("A callback that throws", () => expectPassThrough(() => {
            throw new Error("Failed");
        }));

        test("A callback that changes the statuses before failing", () => expectPassThrough((statuses?: unknown) => {
            (statuses as Array<string>).length = 0;

            throw new Error("Failed");
        }));
    });

    test("The response is sent through the pipeline response event", async () => {
        const sendMessage = mock.fn();

        await FulfilmentFilterPipeline.respond({
            sendMessage,
        } as unknown as BaseBridge, [ "PACKED" ], "request-id");

        assert(sendMessage).wasLastCalledWith(ToShopfront.RESPONSE_UI_PIPELINE, [ "PACKED" ], "request-id");
    });
});
