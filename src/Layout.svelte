<script lang="ts">
  import { DisplayObject } from "@pixi/display";

  import { onMount } from "svelte";
  import { Rectangle, Sprite, Texture, Container, ObservablePoint, Transform } from "pixi.js";
  import { ContextEV, EV } from "./PIXIcontext";


  class LayoutContainer extends Container{
    _transformsCache: Map<Container, number>
    _resizeListen: Function
    constructor(){
      super();
      this._resizeListen = this.resizeListen.bind(this);
    }
    resizeListen(u:Container){
      if(this.children.indexOf(u) < 0) return;
      this.refreshPosition();
    }
    update(){
      this.updateCheck();
      this.refreshPosition();
    }
    updateGC(){
      
    }
    refreshPosition(){
      //to do
    }
  }

  export let Horizontal:boolean = false;
  export let Vertical:boolean = true;
  export let Margin:Array<number> = [5, 5];
  export let Padding:Array<number> = [5, 5];
  onMount(() => {
    const target = new PIXI.Container();
  });
</script>

<slot />
