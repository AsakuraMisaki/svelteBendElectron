// esbuild.config.js

const { promises } = require('fs');
const { preprocess, compile } = require('svelte/compiler');
const j = require('jscodeshift');


// function svelteCompliePostProcess(str, svSign="$$anchor", jsSign="Mounter.create"){
//   const r = new RegExp(`${jsSign}\\s*`, "gi");
//   return str.replace(r, (match)=>{
//     return `new Mounter().anchor(${svSign})._create`;
//   });
// }

function findCloseNode_X(nodeDeclarations, aaLine){
  const candidates = nodeDeclarations.filter(node => node.line < aaLine);
  if (candidates.length === 0) return;

  // 找到最近的 node_x（行号最大）
  const closestNode = candidates.reduce((prev, curr) => 
    curr.line > prev.line ? curr : prev
  );

  return closestNode;
}

const preproessNode_X = function(path){

}

const preproessEach = function(path){

}

function svelteCompliePostProcess(str, codeSign){
  // console.log(str);
  const target = str.split(codeSign);
  
  if(target && target[1] && /app/i.test(codeSign)){
    let c = target[1].trim().replace(/\}.*$/, "");
    const nodeDeclarations = [];
    console.log(c);
    let jj = j(c);
    jj.find(j.VariableDeclarator)
      .forEach((path)=>{
        // console.log(path.node.id && path.node.id.name)
        if(path.node.id && /node_?\d*/i.test(path.node.id.name)){
          // console.log(path.node.id.name);
          let {name} = path.node.id;
          let nd = /node_?(\d*)/i.exec(name);
          let d = 0;
          if(nd && nd[1]){
            d = d[1];
          }
          
          nodeDeclarations.push({
            name,
            d,
            line: path.node.loc.start.line,
          });
          
        }
      })
    jj.find(j.CallExpression)
      .forEach((path)=>{
        // if(path.node.callee.name && path.node.arguments && path.node.arguments[0])
        // console.log(path.node.callee.name)
        if(!path.node.callee.name) return;
        const [a, prop] = path.node.arguments || [];
        // console.log(a, prop);
        if(!a || !prop) return;
        if(!(/^node|^\$\$anchor/i.test(a.name))) return;
        if(!(prop.type == j.ObjectExpression)) return;
        if(!path.node.loc) return;
        let preNode = findCloseNode_X(nodeDeclarations, path.node.loc.start.line);
        console.log(path.node.callee.name, preNode);
        // 在 VariableDeclaration 后插入新代码
        j(path.parent).insertBefore(
          // j(`${preNode.name}.___I___ = ${preNode.d}`)
          j.expressionStatement(j.stringLiteral(`%%% ${preNode.name}.___I___ = ${preNode.d} + ___I___ %%%`))
        )
      })
    let newC = jj.toSource();
    console.warn(newC);
    return target[0] + "\n" + newC + "\n}";
    // console.log(jj);
  }
  const eachLike = str.replace(/\(\$\$anchor[^,]*,\s*item[^,]*\)\s*=>\s*{/, (match)=>{
    // console.log(match);
    const post = match.replace(/\)\s*=>\s*{/, (m)=>{
      return `, __I__${m}`;
    })
    return post;
  });
  const nodeLike = eachLike.replace(/var\s*node/);
  return eachLike;
}

const markComponentsPlugin = {
  name: 'mark-components',
  setup(build) {
    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await promises.readFile(args.path, 'utf8');

      const processed = await preprocess(source, { filename: args.path });

      const codeSign = `console.log("${args.path}${Date.now()}");`;
      // console.log(codeSign);
      const pcode = processed.code.replace(/\<\/script\>/, (m)=>{
        // console.log(m);
        return `\n${codeSign}\n${m}`;
      })
      // console.log(pcode);
      // 编译为 JS
      const data = compile(pcode, {
        generate: 'client',
        hydratable: true
      });
      
      const code = data.js;
      code.code = svelteCompliePostProcess(code.code, codeSign);
      // console.log(code.code += "faffffffffffffafa");
      return { contents: data.js.code };
    });
  }
};

module.exports = {markComponentsPlugin};
