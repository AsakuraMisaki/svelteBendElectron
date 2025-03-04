<script>
  import { onMount } from "svelte";

  export let checked = null;
  export let unchecked = null;
  
  onMount(()=>{
    return ()=>{}
  })
</script>

<slot />
