<script lang="ts">

  import { getContext, onDestroy, onMount } from "svelte";
  import { _Container, Container, ContextEV, globalEVS } from "./sdk";
  import Transform from "./Transform.svelte";
  
  
  export let Horizontal:boolean = false;
  export let Vertical:boolean = true;
  export let Margin:Array<number> = [5, 5];
  export let Padding:Array<number> = [5, 5];

  class LayoutContainer extends _Container{
    _resizeListen: (...args:any)=>void = null
    _refreshChecked: boolean = false;
    constructor(){
      super();
      this._resizeListen = this.resizeListen.bind(this);
      this.on(ContextEV.TransformChanged, this._resizeListen);
    }
    resizeListen(c:Container){
      if(this.children.indexOf(c) < 0) return;
      this._refreshChecked = true;
    }
    update(){
      if(this._refreshChecked){
        this.refreshPosition();
      }
    }
    __GC(){
      globalEVS.delete(this);
    }
    refreshPosition(){
      this._refreshChecked = false;
      let x = Padding[0];
      let y = Padding[1];
      this.children.forEach((c:Container)=>{
        const {width, height} = c;
        c.x = x;
        c.y = y;
        if(Vertical){
          y += height + Margin[1];
        }
        else if(Horizontal){
          x += width + Margin[0];
        }
      })
    }
  }

  let layout = new LayoutContainer();
  onMount(() => {
    globalEVS.set(layout, layout);
    layout._refreshChecked = true;
  });

  onDestroy(()=>{
    layout.__GC();
  })
</script>


<Transform target={layout}>
  <slot/>
</Transform>

