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

// Task:优化:硬层级问题核心，通过解析编译后js中组件-组件锚点分配语句，
// 在组件初始化时自动分配#锚点在文档中的硬层级#给pixi对象
function svelteCompliePostProcess(str, codeSign){
  // console.log(str);
  const target = str.split(codeSign);
  let newC = target[1];
  // console.log(codeSign);
  if(newC){
    let c = newC.trim().replace(/\}.*$/, "");
    const nodeDeclarations = [];
    let jj = j(c);
    // jj.find(j.VariableDeclarator)
    //   .forEach((path)=>{
    //     // console.log(path.node.id && path.node.id.name)
    //     if(path.node.id && /node_?\d*/i.test(path.node.id.name)){
    //       // console.log(path.node.id.name);
    //       let {name} = path.node.id;
    //       let nd = /node_?(\d*)/i.exec(name);
    //       let d = 0;
    //       if(nd && nd[1]){
    //         d = nd[1];
    //       }
          
    //       nodeDeclarations.push({
    //         name,
    //         d,
    //         line: path.node.loc.start.line,
    //       });
          
    //     }
    //   })
    // console.log(nodeDeclarations);
    let d = 0;
    jj.find(j.CallExpression)
      .forEach((path)=>{
        const p = path.node.callee.property;
        if(p && p.name && p.name == "each"){
            const a = path.node.arguments[path.node.arguments.length-1];
            const a0 = a.params[a.params.length - 1];
            // console.log(a0);
            // console.log(jj.find(j.Identifier, { name: a0.name }).forEach((path)=>{
            //   if(path.node === a0){
            //     j(path).insertAfter(
            //       j.expressionStatement(j.stringLiteral(`%%% ___I___ %%%`))
            //     )
            //   }
            //   // console.log(path.node === a0);
            // }));
            // j(a0.path).insertAfter(
            //     j.expressionStatement(j.stringLiteral(`%%% ___I___ %%%`))
            // )
        }
        else{
            // if(path.node.callee.name && path.node.arguments && path.node.arguments[0])
            // console.log(path.node.callee.name)
            if (!path.node.callee.name) return;
            const [a, prop] = path.node.arguments || [];
            // console.log(nodeDeclarations);
            // if(!nodeDeclarations.length) return;
            if (!a || !prop) return;
            if (!(/^node|^\$\$anchor/i.test(a.name))) return;
            if (!(prop.type == j.ObjectExpression)) return;
            // if (!path.node.loc) return;
            // let preNode = findCloseNode_X(nodeDeclarations, path.node.loc.start.line);
            // let d = 0;
            // if(!preNode && path.node.loc.start.line < nodeDeclarations[0].line){
            //   // console.log(codeSign, target[1]);
            // }
            // else if(preNode){
            //   d = preNode.d;
            // }
            
            
            j(path.parent).insertBefore(
                // j(`${preNode.name}.___I___ = ${preNode.d}`)
                j.expressionStatement(j.stringLiteral(`%%% ${a.name}.___I___ = ${d++} %%%;`))
            )
        }   
      })
    newC = jj.toSource();
    newC = newC.replace(/\"\%\%\%\s*/gi, "");
    newC = newC.replace(/\s*\%\%\%\";/gi, "");
    newC = newC.replace(/\s*\%\%\%;\";/gi, ";");
    newC = "\n" + newC + "\n}";
    
  }
  let a = target[0].replace(codeSign, "").replace(/Mounter\.create\s*/gi, (match)=>{
    return `new Mounter().anchor($$anchor)._create`;
  });
  console.warn(newC);
  let b = newC;
  return a + b;
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
