<script lang="ts">
  import { onMount } from "svelte";
  import { PIXI, SDK } from "./PIXIcontext";
  import { Rectangle, Sprite, Texture } from "pixi.js";

  export let url:string = "./img/system/IconSet.png";
  export let frame:Array<number> = [0, 0, 100, 100];
  export let frameAuto:boolean = false;
  onMount(async () => {
    let sprite:Sprite = new PIXI.Sprite();
    
    let texture:Texture = await SDK.safeLoad(url);
    sprite.texture = texture;
    if(frameAuto){
      frame = [0, 0, texture.width, texture.height];
    }
    let newFrame:Rectangle = new PIXI.Rectangle(...frame);
    texture.frame = newFrame;
  });
</script>

<slot />
