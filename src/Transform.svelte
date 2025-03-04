<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { Container, SDK } from "./sdk";

  // svelte层级: pixi层级
  export let target:Container = null;

  setContext("target", target);
  
  onMount(()=>{
    console.warn("????????");
    const parent = getContext("target") as Container;
    if(parent){
      parent.addChild(target);
    }
    
  })
  
</script>

<slot/>
<!-- <slot /> -->
<!-- <slot /> -->
