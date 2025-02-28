
import { Rectangle, Sprite, Texture, Transform, Container } from "pixi.js";
abstract class PIXI { 
  static Rectangle: any
  static Sprite: any
  static Text: any
  static TextStyle: any
  static Texture: any
  static BaseTexture: any
  static RenderTexture: any
  static Container: any
  static DisplayObject: any
  static EventEmitter: any
}

abstract class SDK {
  static safeLoad:(url:string) => Promise<any>
}

class Timer{
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
const EV = new ComponentEV();

const ContextEV = {
  TransformChanged: "transform:changed"
}

class _Transform extends Transform{
  _scopeContainer: Container
  protected onChange(): void {
    super.onChange();
    EV.emit(ContextEV.TransformChanged, this._scopeContainer);
  }
}

class _Container extends Container{
  
}

class _Sprite extends Sprite{
  constructor(...args){
    super(...args);
    this.transform = new Transform();
  }
}

export { PIXI, SDK, Timer, ComponentEV, EV, ContextEV, _Transform, _Sprite, _Container };

