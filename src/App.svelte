<script>
  import { onMount } from "svelte";

  import Sprite from "./Sprite.svelte";

  import Text from "./Text.svelte";
  import Container from "./Container.svelte";
  
  import { ContextKEY } from "./sdk";
  
  let items = $state([]);
  let fps = $state(16);
  let now = performance.now();
  const targetTick = 30;
  let tick = targetTick;
  const targetIcons = ["icon", "icon1", "icon2"];
  let t = () => {
    let lNow = performance.now();
    const ms = Math.floor(lNow - now);
    fps = Math.floor(1000 / ms);
    now = lNow;
    tick -= ms;
    if (tick <= 0) {
      const r = Math.random();
      let text = undefined;
      if (r < 0 && items.length) {
        items.shift();
      }
      else{
        text = r.toString();
        const i = Math.random() * targetIcons.length;
        ;
        const _item = {
          x: items.length * 100,
          url: `./src/${targetIcons[Math.floor(i)]}.png`,
          text,
        }
        console.log(_item.url)
        // items = [_item];
        // items[0] = _item;
        items.push(_item);
        // if(items.length > 1){
        //   items.shift();
        // }
       
      }
      
      tick = targetTick;
    }
    requestAnimationFrame(t);
  };
  onMount(() => {
    // console.log(getContext(ContextKEY._Container), this);
    requestAnimationFrame(t);
  });
</script>

{#each items as item}
  <Container x={item.x} y={item.y || 0}>
    {#if true}
      <!-- Sprite的onMount会更慢被执行完 -->
      <Sprite url={"./src/icon.png"}>
      </Sprite> 
    {/if}
    <!-- Text的onMount会更快被执行完 -->
    <Text text={item.text || ""} fontSize={50}/>
    {#if true}
      <!-- Sprite的onMount会更慢被执行完 -->
      <Sprite url={"./src/icon1.png"}>
      </Sprite> 
    {/if}
    
  </Container>
{/each}
  
<Text y={400} x={50} text={`FPS: ${fps} ${items.length} ${performance.jsHeap}`} fontSize={60}></Text>
