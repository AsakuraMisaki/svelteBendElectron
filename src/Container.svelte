<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import { _Sprite, BaseTexture, _Container, Container, Mounter, Rectangle, SDK, Texture, ContextKEY } from "./sdk";
  

  export let c:_Container = new _Container();
  export let x = 0;
  export let y = 0;
  const pixiTarget = Mounter.create(c);
  
  onMount(async () => {
    // console.log(c);
    pixiTarget.mount();
    
  });
  onDestroy(()=>{
    SDK.remove(c, true);
  })
  
  $: {
    c.x = x;
    c.y = y;
  }
</script>

<slot />


