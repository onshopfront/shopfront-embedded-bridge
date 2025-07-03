import { coreLintingRules } from "@onshopfront/core/linting";

export default [
    ...coreLintingRules({}),
    {
        ignores: [
            "lib/**",
            "tests/**",
            "**/*.js",
        ],
    }, {
        rules: {
            "@typescript-eslint/no-useless-constructor": 0
        }
    }
]
