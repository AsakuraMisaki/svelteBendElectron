<script lang="ts">
  import { ContextEV, EV, SDK } from "./PIXIcontext";
  
  export let x = 0;
  export let y = 0;
  export let width = 0;
  export let height = 0;
  export let scale = {
    x: 1,
    y: 1
  }
  export class Timer{
    static delta: number
    static lastDelta: number
  }
  
</script>

<slot />
