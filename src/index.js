
const { buildCode, esbuild } = require("./entry.js");
const path = require("path");
const { publish, log } = require("./env.js");
const { promises } = require("fs");


if(publish){
  process.chdir(path.dirname(process.execPath));
}

const main = async function(cb){
  
  log(process.execPath + "\n" + process.cwd() + "\n" + JSON.stringify(process.argv));
  
  try{
    const a = process.argv[2];
    
    // if(/^config\=/i.test(a)){
    //   let targetConfig = "";
    //   process.argv.forEach((v, i) => {
    //     targetConfig += v;
    //   })
    //   targetConfig = targetConfig.replace(/^config\=/i, "");
    //   buildCode(JSON.parse(targetConfig));
    // }
    // else 
    if(a || true){
      
      const configs = await esbuild.build(({
        entryPoints: [`src/sv.config.ts`],
        write: false,
        format: "esm",
        bundle: true,
        minify: true
      }))
      const text = configs.outputFiles[0].text.replace((/export\s*{(\w+) as default}/), (match)=>{
        const target = /export\s*{(\w+) as default}/i.exec(match)[1];
        return `return ${target}`;
      })
      log(text);
      configs.outputFiles.forEach(({text})=>{
        log(text);
      })
      
      const configObj = new Function(`${text}`)();
      log(JSON.stringify(configObj));
      buildCode(configObj, cb);
    }
  }catch(e){
    console.error(e);
    process.exit(0);
  }
} 

// main();

module.exports = { main };
