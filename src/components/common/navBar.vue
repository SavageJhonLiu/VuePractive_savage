<template>
  <div class="nav-bar">
    <div class="left" @click="goback">
      <slot name="left">
        <img src="~assets/images/left.png" alt="">
      </slot>
    </div>
    <div class="center">
      <slot>
        Savage-Shop
      </slot>
    </div>
    <div class="right">
      <slot name="right">

      </slot>
    </div>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  export default {
    name: 'navBar',
    setup() {
      const router = useRouter()
      const goback = () => {
        router.go(-1)
      }
      return{
        goback
      }
    }
  };
</script>

<style scoped lang="scss">
.nav-bar{
  height: 48px;
  line-height: 48px;
  text-align: center;
  background-color: var(--color-tint);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  .left{
    width: 50px;
    height: 48px;
    img{
      width: 36px;
      margin-top: 6px;
    }
  }
  .center{
    flex: 1;
    color: var(--color-text);
  }
  .right{
    width: 50px;
  }
}
</style>
