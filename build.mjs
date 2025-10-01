import { execSync } from "node:child_process";
import { readdir, mkdir, rename, rm } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";

// We build using a three-part process:
// 1. Compiling the TypeScript code into a single export
// 2. Building the TypeScript declaration files

// Step 1: Compile the TypeScript code
// This just uses Vite to compile directly
await execSync("npm run-script build:bridge", {
    stdio: "inherit",
});

// Step 2: Build the TypeScript declaration files
// This first runs the TypeScript compiler to export the types to the lib-types folder
// then we merge the types together and move them into the lib folder. Finally we remove
// the lib-types folder.
await execSync("npm run-script build:types", {
    stdio: "inherit",
});

const src = resolve("lib-types");
const dest = resolve("lib");

const moveAndFlatten = async dir => {
    const entries = await readdir(dir, { withFileTypes: true });

    for(const entry of entries) {
        const fullPath = join(dir, entry.name);

        if(entry.isDirectory()) {
            await moveAndFlatten(fullPath);
        } else if(entry.name.endsWith(".d.mts") || entry.name.endsWith(".d.ts")) {
            const flattenedName = fullPath.replace(`${src}/`, "");
            const destPath = join(dest, flattenedName);

            await mkdir(dirname(destPath), { recursive: true });
            await rename(fullPath, destPath);
        }
    }
}

await moveAndFlatten(src);
await rm(src, { recursive: true, force: true });
