import { coreLintingRules } from "@onshopfront/core/linting";

export default [
    ...coreLintingRules({}),
    {
        ignores: [
            "lib/**",
            "**/*.js"
        ],
    }
]
