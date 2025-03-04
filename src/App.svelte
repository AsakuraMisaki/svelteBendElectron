<script>
  import { onMount } from "svelte";

  import Sprite from "./Sprite.svelte";

  import Text from "./Text.svelte";
  import Container from "./Container.svelte";
    import { ContextKEY } from "./sdk";
  let items = $state([{ x: 0 }]);
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
      if (r > 0.5) {
        text = r.toString();
      }
      const _item = {
        x: items.length * 20,
        url: `./src/${targetIcons[Math.floor(Math.random() * targetIcons.length)]}.png`,
        text,
      };
      items.push(_item);
      tick = targetTick;
    }
    requestAnimationFrame(t);
  };
  onMount(() => {
    console.log(getContext(ContextKEY._Container), this);
    requestAnimationFrame(t);
  });
</script>

<div>
  {#each items as item}
    <Container x={item.x} y={item.y || 0}>
      <Sprite url={item.url || "./src/icon.png"}>
        {#if item.text}
          {console.log(true)}
          <Text text={item.text} />
        {/if}
      </Sprite>
    </Container>
  {/each}
</div>
