const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');
const path = require('path');

function parseES5Class(code) {
    const ast = esprima.parseScript(code, { range: true });
    let className = '';
    const methods = {};

    estraverse.traverse(ast, {
        enter(node) {
            console.log(`#${node.type}#`, node);
            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(decl => {
                    if (decl.init && decl.init.type === 'FunctionExpression') {
                        className = decl.id.name;
                    }
                });
            }
            if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
                const left = node.expression.left;
                if (left.type === 'MemberExpression' && left.property.name === 'prototype') {
                    const methodName = left.property.name;
                    const params = node.expression.right.params.map(p => p.name);
                    methods[methodName] = params;
                }
            }
        }
    });

    return { className, methods };
}

function generateTypeScriptFromAST({ className, methods }) {
    let tsClass = `export declare class ${className} {\n`;
    for (const [method, params] of Object.entries(methods)) {
        tsClass += `  ${method}(${params.map(p => `${p}: any`).join(', ')}): any;\n`;
    }
    tsClass += '}';
    return tsClass;
}

// 示例用法
const mixCode = `
var GUI = { };
class ES6{
  constructor(){ }
  static ASDAS(){ }
  async ccccc(){ }
};
ES6.prototype.other = async function faczc(){ };
ES6.ob = new Map();
function A() {};
A.prototype.initfss = function(aaa, bbb) {
    // 方法实现
};
GUI.OK = async function adadasdas(){ };
(()=>{
  function setup(){
    
  }
})();
`;

const { className, methods } = parseES5Class(mixCode);
const tsDeclaration = generateTypeScriptFromAST({ className, methods });
console.log(tsDeclaration);

// 可选：将声明保存到文件
fs.writeFileSync(path.resolve(__dirname, 'A.d.ts'), tsDeclaration);