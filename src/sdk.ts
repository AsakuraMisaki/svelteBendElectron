
import 
{ 
  RenderTexture, 
  TextStyle, 
  Text, 
  Rectangle, 
  Sprite, 
  Texture, 
  Transform, 
  Container, 
  DisplayObject, 
  BaseTexture 
} 
from "pixi.js";


// if(!RenderTexture){ // import fail
//   const { 
//     RenderTexture, 
//     TextStyle, 
//     Text, 
//     Rectangle, 
//     Sprite, 
//     Texture, 
//     Transform, 
//     Container, 
//     DisplayObject, 
//     BaseTexture 
//   } = globalThis.PIXI;
// }

class SDK {
  static async safeLoad(url:string){
    const base = BaseTexture.from(url, {});
    return await this.checkRes(base, ()=>{
      return base.valid;
    })
  }
  static checkRes(res:any, checker){
    const c = (resolve)=>{
      const st = checker();
      if(!st){
        setTimeout(()=>c(resolve), 100);
      }
      else{
        resolve(res);
        return true;
      }
    }
    return new Promise((resolve, reject)=>{
      setTimeout(()=>c(resolve), 100);
    })
  }
  static stage(){
    return globalThis.myStage;
  }
}


abstract class Timer{
  static delta: number
  static lastDelta: number
}


type EVtype = {
  z: number
  once: boolean
  size: number
}

class ComponentEV{
  events: Map<string, Map<Function, EVtype>>
  constructor(){
    this.events = new Map();
  }
  on(name:string, cb:Function, z:number=1, once:boolean=false) {
    let list = this.events.get(name);
    if (!list) {
      this.events.set(name, new Map());
      return this.on(name, cb, z, once);
    }
    let size = list.size;
    list.set(cb, { z, once, size });
    let newList = this.sort(list);
    this.events.set(name, newList);
    return cb;
  }
  sort(list:Map<Function, EVtype>){
    let temp = Array.from(list.entries());
    temp.sort((a, b) => {
      let a1 = a[1];
      let b1 = b[1];
      let z = b1.z - a1.z; //层级越高 越先执行
      if(!z){
        return b1.size - a1.size; //按添加顺序执行
      }
      return z;
    })
    return new Map(temp);
  }
  clear(name:string) {
    if (!name) {
      this.events.clear();
      return;
    }
    this.events.delete(name);
  }
  clearMethods(...methods:Function[]) {
    methods.forEach((m)=>{
      this.events.forEach((map, name)=>{
        map.delete(m);
      })
    })
  }
  once(name, cb, z=1) {
    return this.on(name, cb, z, true);
  }
  off(name:string, cb:Function) {
    if (!cb) {
      this.events.delete(name);
      return;
    }
    let list = this.events.get(name);
    if(!list) return;
    list.delete(cb);
  }
  emitonly(name, cb, ...args) {
    let list = this.events.get(name);
    if (!list) return;
    let options = list.get(cb);
    this._emit(options, cb, list, args);
  }
  emit(name, ...args) {
    let list = this.events.get(name);
    if (!list) return;
    list.forEach((options, cb, list) => {
      this._emit(options, cb, list, ...args);
    })
    return;
  }
  _emit(options, cb, list, ...args:any[]) {
    cb(...args);
    if (options.once) {
      list.delete(cb);
    }
  }
}

const ContextEV = {
  TransformChanged: "transform:changed"
}

const globalEVS = new Map();


class _Transform extends Transform{
  constructor(s:DisplayObject){
    super();
    this._scopeObject = s;
  }
  _scopeObject: DisplayObject
  onChange(): void {
    super.onChange();
    globalEVS.forEach((value:any, key:DisplayObject)=>{
      key.emit(ContextEV.TransformChanged, this._scopeObject);
    })
  }
}

class _Container extends Container{
  constructor(){
    super();
    this.transform = new _Transform(this);
  }
}


class _Text extends Text{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this);
  }
}


class _Sprite extends Sprite{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this);
  }
}

export 
{ 
  RenderTexture, 
  TextStyle, 
  _Text, 
  Rectangle,
  _Sprite, 
  Texture, 
  _Transform, 
  _Container, 
  Container,
  DisplayObject, 
  BaseTexture,
  SDK,
  Timer,
  ComponentEV,
  ContextEV,
  globalEVS
}


