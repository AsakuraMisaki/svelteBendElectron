<script>
  import { onMount } from "svelte";
  
  import Sprite from "./Sprite.svelte";
  
  import Text from "./Text.svelte";
    import Container from "./Container.svelte";
  let items = $state([{x:0}]);
  let fps = $state(16);
let now = performance.now();
const targetTick = 1000;
let tick = targetTick;
let someCon = $state(false);
const targetIcons = ["icon", "icon1", "icon2"];
let t = ()=>{
  let lNow = performance.now();
  const ms = Math.floor(lNow - now);
  fps = Math.floor(1000 / ms);
  now = lNow;
  tick -= ms;
  if(tick <= 0 ){
    someCon = !someCon
    tick = targetTick
  }
  requestAnimationFrame(t);
}
onMount(()=>{
  requestAnimationFrame(t);
})




</script>

<div>
  <!-- svelte层级问题 -->
  <Container>
    {#if someCon}
      <!-- Sprite的onMount会更慢被执行完 -->
      <Text text={"./src/icon.png"} y={60}>
      </Text> 
    {/if}
    {#if someCon}
      <!-- Sprite的onMount会更慢被执行完 -->
      <Sprite url={"./src/icon.png"}>
      </Sprite> 
    {/if}
    <!-- Text的onMount会更快被执行完 -->
    <Text text={someCon} y={20}/>
    <!-- 这种条件渲染的情况下，Text和Sprite组件如何正确获取组件本身在Container中的层级
      比如Sprite的条件符合时，Sprite组件初始化时能接收到相关位置参数
      因为我需要将这个位置参数传递给Sprite组件的某些变量
      不要显式说明该位置，需要自动获取
     -->
  </Container>
</div>

