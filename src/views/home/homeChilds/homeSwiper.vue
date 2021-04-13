<template>
  <van-swipe v-if="slides.length" class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item class="van-swipe-item" v-for="(item, index) in slides" :key="index" style="overflow: hidden">
      <img v-lazy="item.img_url"/>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
  export default {
    name: "homeSwiper",
    props: {
      slides: Array,
      default () {
        return []
      }
    }
  }
</script>

<style scoped>
.my-swipe{
  height: 160px;
}
img {
  width:100%;
}
</style>