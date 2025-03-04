<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { _Sprite, BaseTexture, _Container, Container, Mounter, Rectangle, SDK, Texture, ContextKEY } from "./sdk";
  

  export let c:_Container = new _Container();
  export let x = 0;
  export let y = 0;
  const pixiTarget = Mounter.create(c);
  console.log(getContext(ContextKEY._Container), this);
  onMount(async () => {
    
    pixiTarget.mount();
  });
  $: {
    c.x = x;
    c.y = y;
  }
</script>

<slot />


