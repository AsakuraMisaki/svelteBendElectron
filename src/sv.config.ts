import { BuildOptions } from "./types";

export default ({
  bundle: true,
  entryPoints: ["src/App.svelte"],
  format: "esm",
  // write: false,
  
  outdir: "out",
} as BuildOptions);