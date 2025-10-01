import { shopfrontToJestConfig } from "@onshopfront/core/tests/config";

export default shopfrontToJestConfig({
    setupAfterEnv: {
        global: [ "<rootDir>/tests/setup.ts" ],
    },
});
