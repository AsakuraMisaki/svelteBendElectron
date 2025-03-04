<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { _Text, BaseTexture, Container, ContextKEY, Mounter, Rectangle, SDK, Texture } from "./sdk";

  class TextLike{
    _content: Object;
    constructor(_content:Object){
      this._content = _content;
    }
    get content():string{
      return this._content.toString();
    }
  }

  export let text:Object = null;
  export let fontSize:number = 16;
  export let y = 0;
  export let x = 0;
  let _ = new _Text();
  const pixiTarget = Mounter.create(_);
  console.log(getContext(ContextKEY._Container), this);
  onMount(async () => {
   
    pixiTarget.mount();
  });
  $: {
    _.text = new TextLike(text).content;
    _.style.fontSize = fontSize;
    _.y = y;
    _.x = x;
  }
</script>

<slot />


