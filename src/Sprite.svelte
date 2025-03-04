<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { _Sprite, BaseTexture, Container, Rectangle, SDK, Texture } from "./sdk";
  import Transform from "./Transform.svelte";

  export let url:string = "";
  export let frame:Array<number> = [0, 0, 0, 0];
  export let frameAuto:boolean = true;
  export let sprite:_Sprite = new _Sprite();
  export let x = 0;
  export let y = 0;
  onMount(async () => {
    // console.log(sprite);
    let b:BaseTexture = await SDK.safeLoad(url);
    let texture:Texture = new Texture(b);
    sprite.texture = texture;
    if(frameAuto){
      frame = [0, 0, texture.width, texture.height];
    }
    let newFrame:Rectangle = new Rectangle(...frame);
    texture.frame = newFrame;

    SDK.stage().addChild(sprite);
    sprite.x = x;
    sprite.y = y;
  });
</script>

<slot />


