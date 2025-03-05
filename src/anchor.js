// esbuild.config.js

const { promises } = require('fs');
const { preprocess, compile } = require('svelte/compiler');



function svelteCompliePostProcess(str, svSign="$$anchor", jsSign="Mounter.create"){
  const r = new RegExp(`${jsSign}\\s*`, "gi");
  return str.replace(r, (match)=>{
    return `new Mounter().anchor(${svSign})._create`;
  });
}

const markComponentsPlugin = {
  name: 'mark-components',
  setup(build) {
    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await promises.readFile(args.path, 'utf8');

      const processed = await preprocess(source, { filename: args.path });

      
      // 编译为 JS
      const data = compile(processed.code, {
        generate: 'client',
        hydratable: true
      });
      
      const code = data.js;
      code.code = svelteCompliePostProcess(code.code);
      // console.log(code.code += "faffffffffffffafa");
      return { contents: data.js.code };
    });
  }
};

module.exports = {markComponentsPlugin};
