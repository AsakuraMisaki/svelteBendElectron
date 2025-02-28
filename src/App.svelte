<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  
  import MyComponent from './Button.svelte';
    import Button from './Button.svelte';
    import Layout, { Types } from './Layout.svelte';
  
  onMount(()=>{

  })
</script>

<div>
  <Layout>

  </Layout>
  <Button url={"./img/system/IconSet.png"}>
    <Button url={"./img/system/Window.png"}></Button>
  </Button>
</div>
