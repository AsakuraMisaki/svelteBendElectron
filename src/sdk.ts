
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
  BaseTexture, 
  Renderer
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
  DisplayobjectRemove: "Displayobject:Remove",
  ChildrenMount: "Children:Mount" 
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
globalEVS.set(ContextEV.TransformChanged, new Set());
globalEVS.set(ContextEV.ChildrenMount, new Map());

class _Transform extends Transform{
  constructor(s:DisplayObject){
    super();
    this._scopeObject = s;
  }
  _scopeObject: DisplayObject
  onChange(): void {
    super.onChange();
    // Task:优化:布局/大小变化等侦听
    const target = globalEVS.get(ContextEV.TransformChanged);
    target.forEach((key:DisplayObject)=>{
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

// Task:优化:硬层级问题，pixi对象完全按xml元素层级进行层级分配，兼容async挂载，if/each等语句
class Mounter{
  static key: Symbol | null = ContextKEY._Container
  static temp: number = 0;
  target: Container | null
  parent: Container | null
  _anchor: Element | null
  temp: number
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
    
    this.target.___I___ = this._anchor.___I___; 
    this.target.___tempI___ = Mounter.temp++;
    // Task:bug 相同硬层级___I___如each语句兼容仍然有问题
    // 比如<each><if><Sprite></if><Text></each>
    // Sprite硬文档层级是1, 下次each中I是1而tempI也是1，总层级是2，而此时each中生成的Text仍然是层级2
    // 一个处理是在anchor.js中还原对each语句的处理，获取当前each的次数*对应硬层级
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
    if(parent == SDK.stage()){
      parent.addChild(target);
      return;
    }
    let evScope = globalEVS.get(ContextEV.ChildrenMount).get(parent);
    if(!evScope){
      evScope = new Set();
    }
    evScope.add(target);
    globalEVS.get(ContextEV.ChildrenMount).set(parent, evScope);
    // parent.addChild(target as DisplayObject);
    // if(i0 == undefined){
    //   console.warn("child index can not be found, child would be added at last");
    // }
    
  }
  static get ctx():DisplayObject{
    const parent = getContext(this.key) as Container;
    return parent || SDK.stage();
  }
}

// Task:优化:用svelte.afterUpdate处理而非addChild或render时处理
const RenderMount = function(){
  let data:DisplayObject[] = globalEVS.get(ContextEV.ChildrenMount).get(this);
  if(data){
    this.addChild(...Array.from(data));
    this.children.sort((a:DisplayObject, b:DisplayObject)=>{
      let ii:number = a.___I___ || 0;
      let iii:number = b.___I___ || 0;
      if(ii === iii){
        return a.___tempI___ - b.___tempI___;
      }
      return (ii - iii);
    })
    globalEVS.get(ContextEV.ChildrenMount).delete(this);
  }
}

class _Container extends Container{
  constructor(){
    super();
    this.transform = new _Transform(this as DisplayObject);
  }
  render(renderer: Renderer): void {
    super.render(renderer);
    RenderMount.call(this);
  }
}


class _Text extends Text{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this as DisplayObject);
  }
  render(renderer: Renderer): void {
    super.render(renderer);
    RenderMount.call(this);
  }
}


class _Sprite extends Sprite{
  constructor(...args:any[]){
    super(...args);
    this.transform = new _Transform(this as DisplayObject);
  }
  render(renderer: Renderer): void {
    super.render(renderer);
    RenderMount.call(this);
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


