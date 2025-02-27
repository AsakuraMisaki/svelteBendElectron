

// 序列化管线
class Serialization{
  constructor(){
    this.logs = new Map();
  }
  serialize(){

  }
  _2TS(typeData){
    const type = (typeof(typeData));
    switch (type){
      case "function": {
        const params = this.getFunctionParams(typeData).map((name)=>{
          return `${name}:any`;
        });
        const value = `(${params.toString()})=>any`;
        return value;
      }
      case "object": {
        if(typeData == null) return "null";
        if(Array.isArray(typeData)){
          this.serializeArray(typeData);
        }
        else if(typeData instanceof Map || typeData instanceof Set || typeData instanceof Date){
          this.serializeNative(typeData, typeData.constructor);
        }
        else{
          this.serializeClass(typeData);
        }
        return;
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
    all.forEach(([name, data])=>{
      if(["constructor", "length"].indexOf(name) >= 0) return;
      if(name == "prototype") return this._serializeClass(data.value, data);
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
  target: "target",
  c: new CustomClass()
}

const t = new Serialization();

console.log(t.getFunctionParams(CustomClass.prototype.only));

console.log();
module.exports = {Project};