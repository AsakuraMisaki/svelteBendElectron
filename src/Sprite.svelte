<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import { _Sprite, BaseTexture, Container, ContextKEY, Mounter, Rectangle, SDK, Texture } from "./sdk";

  export let url:string = "";
  export let frame:Array<number> = [0, 0, 0, 0];
  export let frameAuto:boolean = true;
  export let sprite:_Sprite = new _Sprite();
  export let x = 0;
  export let y = 0;
  
  const pixiTarget = Mounter.create(sprite);
  let ref;
  onMount(async () => {
    
    let b:BaseTexture = await SDK.safeLoad(url);
    let texture:Texture = new Texture(b);
    sprite.texture = texture;
    if(frameAuto){
      frame = [0, 0, texture.width, texture.height];
    }
    let newFrame:Rectangle = new Rectangle(...frame);
    texture.frame = newFrame;
    sprite.x = x;
    sprite.y = y;
    
    console.log("Sprite");
    pixiTarget.mount();
  });

  onDestroy(()=>{
    SDK.remove(sprite, true);
  })
</script>

<slot/>


