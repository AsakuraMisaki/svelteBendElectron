<script>
  import { onMount } from "svelte";

  export let url = "./img/system/IconSet.png";
  onMount(() => {
    let sprite = new PIXI.Sprite(PIXI.Texture.from(url));
    if (/iconset/i.test(url)) {
      sprite.x = 200;
    }
    SceneManager._scene.addChild(sprite);
    console.warn(url);
  });
</script>

<slot />
