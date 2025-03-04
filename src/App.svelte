<script>
  import { onMount } from "svelte";

  import Sprite from "./Sprite.svelte";

  import Text from "./Text.svelte";
  import Container from "./Container.svelte";
  import { ContextKEY } from "./sdk";
  let items = $state([]);
  let fps = $state(16);
  let now = performance.now();
  const targetTick = 300;
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
      if (r < 0.5 && items.length) {
        // items.shift();
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
        if(items.length > 1){
          items.shift();
        }
       
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

<div>
  {#each items as item}
    <Container x={item.x} y={item.y || 0}>
      {#if Number(item.text) > 0.7}
        <!-- Sprite的onMount会更慢被执行完 -->
        <Sprite url={item.url || "./src/icon.png"}>
        </Sprite> 
      {/if}
      <!-- Text的onMount会更快被执行完 -->
      <Text text={item.text || ""} />
      <!-- 这种条件渲染的情况下，Text和Sprite组件如何正确获取组件本身在Container中的层级
        比如Sprite的条件符合时，Sprite组件初始化函数中需要能获取到其位置即0
       -->
    </Container>
  {/each}
  <Text y={500} x={50} text={`FPS: ${fps} ${items.length} ${performance.jsHeap}`}></Text>
</div>
