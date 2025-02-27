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
  serialize(){
    Serialization.Types.set(this.jsonObject, `Types${Serialization.Types.size}`);
    let jsonObj = {};
    for(const key in this.jsonObject){
      jsonObj[key] = this._2TS(this.jsonObject[key]);
    }
    console.log(this.logs, jsonObj);
    this.targetText = JSON.stringify(jsonObj, 2).replace(/"/g, "");
    // _log(this.targetText);
    return this;
  }
  _2TS(typeData){
    const type = (typeof(typeData));
    
    switch (type){
      // ES5-: check function getOwnPropertyDescriptors [writable] to process function as a class;
      case "function": {
        const params = this.getFunctionParams(typeData).map((name)=>{
          return `${name}:any`;
        });
        
        const value = `(${params.toString()})=>any`;
        return value;
      }
      case "object": {
        if(typeData == null) return "null";
        const loop = Serialization.Types.get(typeData);
        if(loop){
          return loop;
        }
        if(typeData.constructor === Object){
          new Serialization(typeData).serialize();
          return Serialization.Types.get(typeData);
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
      default: {
        return type;
      }
    }
  }
  getFunctionParams(func) {
    const funcStr = func.toString();
    const result = funcStr.match(/\(([^)]*)\)/);
    
    let params = [];
    if (result) {
        params = result[1].split(',').map(param => param.trim()).filter(param => param);
    }
    return params;
  }
  serializeClass(classObject){
    const target = { };
    this.logs.set(Symbol(classObject.name), target);
    this._serializeClass(classObject, target);
  }
  _serializeClass(classObject, target){
    const all = Object.entries(Object.getOwnPropertyDescriptors(classObject));
    // console.log(all);
    all.forEach(([name, data])=>{
      if(["constructor", "length"].indexOf(name) >= 0) return;
      if(name == "prototype") return this._serializeClass(data.value, target);
      console.log(name, typeof(data.value));
      target[name] = this._2TS(data.value);
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

const A = {
  a: new Date(0),
  b: 0,
  target: new Map(),
  c: new CustomClass()
}
A.target.set(A.c, {b:0, c:0, A});
const t = new Serialization({a:new Promise((resolve, reject)=>{})});

t.serialize();

Array.from(Serialization.Types.entries()).forEach(([key, data])=>{
  console.log(key.constructor.name, data);
})  
Serialization.Types.clear();

module.exports = {Project};