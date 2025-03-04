import { BuildOptions } from "./types";
// export declare class A {
//   init(aaa:any, bbb:any):any
  
// }
export default ({
  bundle: true,
  entryPoints: ["src/eee.ts"],
  format: "esm",
  mainFields: ["svelte", "browser", "module", "main"],
  conditions: ["svelte", "browser"],
  write: false,
  external: ["pixi.js", "pixi.mjs"],
  outdir: "out",
  minify: true,
} as BuildOptions);