// Copies MapLibre's web worker (and the shared module it imports) into public/
// so it can be loaded by URL at runtime. Turbopack copies the worker as a hashed
// static asset but not its relative import, which 404s inside the worker and
// silently breaks vector tile loading. Same fix as Hopamine's script of this name.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const maplibreDistDirectory = join(projectRoot, "node_modules", "maplibre-gl", "dist");
const publicMaplibreDirectory = join(projectRoot, "public", "maplibre");

mkdirSync(publicMaplibreDirectory, { recursive: true });
for (const workerFile of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(maplibreDistDirectory, workerFile), join(publicMaplibreDirectory, workerFile));
}
console.log(`copied maplibre worker to ${publicMaplibreDirectory}`);
