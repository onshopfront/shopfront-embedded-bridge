import { mock } from "@onshopfront/core/tests";
import UUID from "../src/Utilities/UUID.js";

mock(UUID, [
    {
        method        : "generate",
        implementation: mock.fn(() => "test-uuid"),
    },
]);

