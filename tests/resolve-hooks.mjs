// Lets plain Node load the app's TypeScript: maps "@/..." to src/ and adds the
// missing ".ts" extension, like the bundler does.
// shortcut: hand-rolled resolution, switch to vitest if tests grow beyond a few files.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const src = pathToFileURL(fileURLToPath(new URL("../src/", import.meta.url)));

export async function resolve(specifier, context, next) {
  if (specifier === "next/server") specifier = "next/server.js"; // next has no "exports" map
  let url = specifier.startsWith("@/") ? new URL(specifier.slice(2), src).href : null;
  if (!url && specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
    url = new URL(specifier, context.parentURL).href;
  }
  if (url && !existsSync(fileURLToPath(url)) && existsSync(fileURLToPath(url + ".ts"))) url += ".ts";
  return next(url ?? specifier, context);
}
