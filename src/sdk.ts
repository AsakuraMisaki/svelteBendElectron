
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
import { getContext, setContext } from "svelte";



class SDK {
  static remove(target:DisplayObject, destroy:boolean=false){
    if(destroy){
      target.removeAllListeners();
      if(target instanceof Sprite && target.texture){
        target.texture.removeAllListeners();
      }
    }
    if(!target.parent) return;
    let parent = target.parent;
    parent.removeChild(target);
    target.emit(ContextEV.DisplayobjectRemove, parent);
  }
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
    if(typeof(GlobalContext.current.stage) == "function"){
      return GlobalContext.current.stage();
    }
    return GlobalContext.current.stage;
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
  TransformChanged: "transform:changed",
  DisplayobjectRemove: "Displayobject:Remove"
}
const ContextKEY = {
  _Container: Symbol("_Container")
}
enum ContextSveltePIXIhidden{
  AnchorIndex
}
class GlobalContext{
  static _current: GlobalContext;
  static set current(_:GlobalContext){
    this._current = _;
  }
  static get current(){
    return this._current || new GlobalContext();
  }
  stage: ()=>DisplayObject | DisplayObject
  constructor(){}
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

function findMatchingParen(str, startIndex) {
  let stack = 1; // 初始化为1，因为 startIndex 是左括号的位置
  let inString = false; // 是否在字符串内
  let stringQuote = ''; // 当前字符串的引号类型（'或"）
  let escape = false; // 是否处于转义字符后

  for (let i = startIndex + 1; i < str.length; i++) {
    const char = str[i];

    // 处理转义字符
    if (escape) {
      escape = false;
      continue;
    }

    if (inString) {
      if (char === '\\') {
        escape = true;
      } else if (char === stringQuote) {
        inString = false;
      }
    } else {
      switch (char) {
        case '(':
          stack++;
          break;
        case ')':
          stack--;
          if (stack === 0) return i;
          break;
        case '"':
        case "'":
          inString = true;
          stringQuote = char;
          break;
      }
    }
  }
  return -1; // 未找到匹配
}

class Mounter{
  static key: Symbol | null = ContextKEY._Container
  target: Container | null
  parent: Container | null
  _anchor: Element | null
  _onMount: (...args:any)=>void | null
  constructor(){ }
  anchor(a:Element){
    this._anchor = a;
    return this;
  }
  _create(target:DisplayObject){
    const parent = Mounter.ctx as Container;
    setContext(Mounter.key, target);
    this.target = target as Container; 
    this.parent = parent;
    
    this.target.$$sv_anchor = this._anchor;
    return this;
  }
  static create(target:DisplayObject){
    let m = new Mounter();
    m._create(target);
    return m;
  }
  release(){
    this.target = null;
    this.parent = null;
    this._anchor = null;
  }
  onMount(cb:(...args:any)=>void){
    this._onMount = cb;
  }
  async mount(){
    let {parent, target, _anchor} = this;
    let i;
    if(_anchor && _anchor.parentNode){
      console.log(_anchor);
      i = Array.from(_anchor.parentNode.childNodes).indexOf(_anchor);
      console.warn(i);
    }
    this.release();
    if(!parent || !target) return;
    this._mount(parent as Container, target as Container, i);
  }
  _mount(parent:Container, target:Container, ...svs:any){
    let i0 = Mounter.getSVctx(ContextSveltePIXIhidden.AnchorIndex, target as DisplayObject);
    let i1 = Mounter.getSVctx(ContextSveltePIXIhidden.AnchorIndex, parent as DisplayObject);
    parent.addChild(target as DisplayObject);
    if(i0 == undefined){
      console.warn("child index can not be found, child would be added at last");
    }
    else if(i1 != undefined){
      parent.children.sort((a:DisplayObject, b:DisplayObject)=>{
        let ii:number = Mounter.getSVctx(ContextSveltePIXIhidden.AnchorIndex, a) || 0;
        let iii:number = Mounter.getSVctx(ContextSveltePIXIhidden.AnchorIndex, b) || 0;
        return (ii - iii);
      })
    }
  }
  static getSVctx(type:number, d:DisplayObject){
    if(d.$$sv_anchor == undefined) return;
    if(type === ContextSveltePIXIhidden.AnchorIndex){
      let i = Array.from(d.$$sv_anchor.parentNode.childNodes).indexOf(d.$$sv_anchor);
      return i || 0;
    }
  }
  static setSVctx(type:number, d:DisplayObject, data:any){
    if(type === ContextSveltePIXIhidden.AnchorIndex){
      return d.$$sv_anchorIndex = data;
    }
    return data;
  }
  static get ctx():DisplayObject{
    const parent = getContext(this.key) as Container;
    return parent || SDK.stage();
  }
}


class _Container extends Container{
  constructor(){
    super();
    this.transform = new _Transform(this as DisplayObject);
  }
}


class _Text extends Text{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this as DisplayObject);
  }
}


class _Sprite extends Sprite{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this as DisplayObject);
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
  globalEVS,
  Mounter,
  GlobalContext,
  ContextKEY
}


