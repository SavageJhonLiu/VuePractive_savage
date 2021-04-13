<template>
  <div class="rbs">
    <div class="rbs-item" v-for="(item, index) in recommends.slice(0, 4)" :key="index">
      <a href="" @click.prevent="toD(item.id)">
        <img v-lazy="item.cover_url" alt="">
        <span>{{item.title}}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'RecommendBooks',
  props:{
    recommends:{
      type: Array,
      default(){
        return []
      },
    },
  },
  setup(){
    const router = useRouter()
    const toD = (id) => {
      router.push({'path': '/detail', 'query': {id}})
    }
    return {
      toD
    }
  }
}
</script>

<style scoped lang="scss">
  .rbs{
    width: 100vw;
    height: 134px;
    justify-content: space-around;
    display: flex;
    margin: 10px 0;
    padding-bottom: 22px;
    border-bottom: solid 9px lightgray;
    .rbs-item{
      display: inline-block;
      width: 25vw;
    }
  }
  span{
    display: inline-block;
    margin-top: -4px;
    font-size: 4px !important;
  }
</style>