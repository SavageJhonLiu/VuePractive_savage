<template>
  <div class="glItem" @click="toD">
      <img :src="good.cover_url" alt="">
      <span>{{ good.title }}</span>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'GoodsListItems',
  props: {
    good: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  setup(props){
    const router = useRouter()

    return{
      toD(){
        router.push({path:'/detail',query: {id:props.good.id}})
      }
    }
  }

}
</script>

<style scoped lang="scss">
.glItem{
  width: 46%;
  position: relative;
  text-align: center;
  img{
    width: 100%;
  }
}
</style>