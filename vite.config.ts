import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: "esnext",
        lib   : {
            entry: {
                "index"   : "./src/index.mts",
                "database": "./src/APIs/Database/index.mts",
            },
            name    : "@shopfront/bridge",
            formats : [ "es" ],
            fileName: (_, entryName) => `${entryName}.mjs`,
        },
        rollupOptions: {
            output: {
                entryFileNames: "[name].mjs",
            },
        },
        outDir     : "./lib",
        emptyOutDir: true,
        sourcemap  : true,
    },
});
