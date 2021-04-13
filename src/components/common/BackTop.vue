<template>
  <div class="backtop" @click="backtop">

  </div>
</template>

<script>
export default {
  name: "BackTop",
  setup(props, {emit}){
    return {
      backtop:()=>{
        emit('bTop');
      }
    }
  }
}
</script>

<style scoped>
.backtop{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background:#ffffff url("~assets/images/btop.png") no-repeat center center;
  z-index: 31;
  position: fixed;
  right: 16px;
  bottom: 80px;
}
</style>