// import * as esbuild from "esbuild";
// import { BuildOptions } from "esbuild";
// import {default as sveltePlugin} from "esbuild-svelte";
// import {sveltePreprocess} from "svelte-preprocess";

const esbuild = require("esbuild");
const sveltePlugin = require("esbuild-svelte");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const { log } = require("./env.js");
// const svelte = require("svelte");

// // console.log(svelte);
// import path from "path";
// import * as esbuild from "esbuild";
// import sveltePlugin from "esbuild-svelte";
// import { sveltePreprocess } from "svelte-preprocess";
// import { log } from "./env.js";
// import * as svelte from "svelte";

// console.log(svelte.SvelteComponent);

const buildCode = async function(argv){
  argv.plugins = [
    sveltePlugin({
      preprocess: sveltePreprocess(),
    }),
  ]
  try{
    const result = await esbuild.build(argv);
    const outputFiles = result.outputFiles || []; // 获取输出文件内容
    let codes = {};
    outputFiles.forEach(file => {
      codes[path.basename(file.path).replace(path.extname(file.path), "")] = file.text.toString();
      // console.log(`--- Output for ${file.path} ---`);
      // console.log(file.contents.toString()); // 输出代码字符串
    });
    log(JSON.stringify(codes));
    // process.exit(1);
  }
  catch(e){
    log(`${e.message}\n${e.stack}`);
    // process.exit(0);
  }
}


module.exports = {buildCode, esbuild};