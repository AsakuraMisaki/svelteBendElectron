// const path = require("path");
// const { log, _log } = require("./env");
// const { ChildProcess } = require("child_process");

// 序列化管线
class Serialization{
  constructor(jsonObject){
    this.logs = new Map();
    this.jsonObject = jsonObject;
    this.targetText = "";
  }
  static Types = new Map();
  asClass(typeData){
    return Object.entries(Object.getOwnPropertyDescriptors(typeData)).filter(([key, value])=>{
      return value.writable && !(key === "prototype" || key === "constructor" || key === "name")
    })
  }
  serialize(){
    let targetString = "";
    for(const key in this.jsonObject){
      const valids = this.asClass(this.jsonObject[key]);
      if(valids){
        targetString += `export class ${key}{\n ${this.getString(this.jsonObject[key])} \n}`;
      }
    }
    
  }
  getString(target){

  }
  beforeEsprima(typeData){
    const type = (typeof(typeData));
    
    switch (type){
      // ES5-: check function getOwnPropertyDescriptors [writable] to process function as a class;
      case "function": {
        const all = Object.entries(Object.getOwnPropertyDescriptors(typeData)).filter(([name, data])=>{
          return (data.writable) && (name != "constructor") && (name != "prototype");
        });
        if(all.length){
          this.serializeClass(typeData);
          return typeData.constructor.name;
        }
        const data = this.getFunctionParams(typeData);
        const params = data.params.map((name)=>{
          return `${name}:any`;
        });
        const value = `${data.async ? "async " : ""}(${params.toString()})=>any`;
        return value;
      }
      case "object": {
        return this._object2TS(typeData);
      }
      default: {
        return type;
      }
    }
  }
  _object2TS(typeData){
    if(typeData == null) return "null";
    const typed = Serialization.Types.get(typeData);
    if(typed){
      return typed[0];
    }
    if(typeData.constructor === Object){
      const s = new Serialization(typeData).serialize();
      const typed = Serialization.Types.get(s.jsonObject);
      return typed[0]; 
      // const typed = Serialization.Types.has(typeData) ? Serialization.Types.get(typeData)[0] : "Object";
      // return typed ? typed[0] : "Object"; 
    }
    else if(Array.isArray(typeData) || typeData instanceof Set){
      const T = typeData instanceof Set ? "Set" : "Array";
      const target = Array.from(typeData).filter((data)=>{
        return data;
      })
      if(!target[0]){
        return `${T}<any>`;
      }
      else{
        return `${T}<${this._2TS(target[0])}>`;
      }
    }
    else if(typeData instanceof Map){
      const target = typeData.entries().next().value;
      if(!target){
        return "Map<any>";
      }
      else{
        const [key, value] = target;
        return `Map<${this._2TS(key)}, ${this._2TS(value)}>`;
      }
    }
    else if(/\[native code\]/i.test(typeData.constructor.toString())){
      return typeData.constructor.name;
    }
    else{
      this.serializeClass(typeData.constructor);
      return typeData.constructor.name;
    }
  }
  getFunctionParams(func) {
    const funcStr = func.toString();
    const result = funcStr.match(/\(([^)]*)\)/);
    
    let params = [];
    if (result) {
        params = result[1].split(',').map(param => param.trim()).filter(param => param);
    }
    return {params, async:/^async/.test(funcStr)};
  }
  serializeClass(classObject){
    const target = { };
    this.logs.set(Symbol(classObject.name), target);
    this._serializeClass(classObject, target);
  }
  _serializeClass(classObject, target, isStatic=true){
    const all = Object.entries(Object.getOwnPropertyDescriptors(classObject)).filter(([name, data])=>{
      return (data.writable || name == "prototype") && (name != "constructor");
    });
    // console.log(all);
    all.forEach(([name, data])=>{
      // if(["constructor", "length", "arguments", "caller", "name"].indexOf(name) >= 0) return;
      if(name == "prototype") return this._serializeClass(data.value, target, false);
      console.log(name, typeof(data.value));
      target[name] = {type: this._2TS(data.value), isStatic};
    })
  }
  serializeArray(arrayObject){

  }
  serializeNative(nativeObject){
    if(nativeObject instanceof Map){
      
    }
  }
}

class Project{
  constructor(name){
    this.name = name; //项目名
  }
  // 编译svelte为纯文本
  complie(){

  }
}



class CustomClass{
  constructor(){

  }
  only(a, b){

  }
}
// ES6 Object format
const A = {
  a: new Date(0),
  b: 0,
  target: new Map(),
  c: new CustomClass(),
  d: async (faf, faa)=>{ }
}
A.target.set(A.c, {b:0, c:0, A});
const t = new Serialization(A);

// t.serialize();

// ES5-
const BB = function(){ };
BB.prototype.initB = function(){ };

const AA = function(){ };
AA.prototype.init = function(){ };
AA.prototype.initA = async function(){ };
AA._scene = BB;
AA._sceneTarget = new BB();

// const t1 = new Serialization({AA, BB});

// t1.serialize();

// Array.from(Serialization.Types.entries()).forEach(([key, data])=>{
//   console.log(key.constructor.name, data);
// })  
// Serialization.Types.clear();


