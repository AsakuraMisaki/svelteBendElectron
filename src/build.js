import { esbuild } from "./entry.js";
esbuild.build({
  entryPoints: ["src/index.js"],
  platform: "node",
  format: "iife",
  outfile: "main.js",
  bundle: true,
})