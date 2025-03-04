<script>
  import { onMount } from "svelte";
  
  import Sprite from "./Sprite.svelte";
  
  import Text from "./Text.svelte";
  let items = $state([{x:0}]);
  let fps = $state(16);
let now = performance.now();
const targetTick = 16;
let tick = targetTick;
const targetIcons = ["icon", "icon1", "icon2"];
let t = ()=>{
  let lNow = performance.now();
  const ms = Math.floor(lNow - now);
  fps = Math.floor(1000 / ms);
  now = lNow;
  tick -= ms;
  if(tick <= 0){
    const _item = {y:items.length * 10, url:`./src/${targetIcons[Math.floor(Math.random() * (targetIcons.length))]}.png`}
    items.push(_item);
    tick = targetTick;
  }
  requestAnimationFrame(t);
}
onMount(()=>{
  requestAnimationFrame(t);
})




</script>

<div>

{#each items as item}
  <Sprite url={item.url || "./src/icon.png"} y={item.y}>
    
  </Sprite>
{/each}
<Text x={300} text={`FPS:${fps}  ${items.length}`}/>
</div>

