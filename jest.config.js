import { createTsESMConfig } from "@onshopfront/core/tests/config";

export default {
    ...createTsESMConfig("./tsconfig.json"),
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    verbose: true,
    resolver: "ts-jest-resolver",
};
