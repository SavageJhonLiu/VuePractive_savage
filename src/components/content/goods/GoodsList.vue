<template>
  <div class="goodItem">
      <GoodsListItems  v-for="(item, index) in goods" :key="index" :good="item"></GoodsListItems>
  </div>
</template>

<script>
import GoodsListItems from 'components/content/goods/GoodsListItems';

export default {
  name: "GoodsList",
  props: {
    goods: {
      type:Array,
      default(){
        return []
      }
    }
  },
  components:{
    GoodsListItems,
  }
}
</script>

<style scoped lang="scss">
  .goodItem{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-top: 26px;
  }
</style>