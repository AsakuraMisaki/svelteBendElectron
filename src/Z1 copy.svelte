<script>

</script>

<slot/>

<!-- App.svelte -->
<Sprite url={item.url || "./src/icon.png"}>
</Sprite>

<!-- Sprite.svelte -->
<Z1>
  <slot/>
</Z1>

<!-- Z1.svelte -->
<slot/>

<!-- 使用esbuild构建App.svelte，Sprite.svelte中的Z1没有被编译 -->