<template>
  <div class="tab-control">
    <div class="tab-control-item" v-for="(item, index) in titles" :key="index" @click="tbItemClick(index)"
    :class="{active: index == currentIndex }">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'tabControl',
  props:{
    titles:{
      type:Array,
      default(){
        return []
      }
    }
  },
  setup(props,{emit}){
    let currentIndex = ref(0);
    const tbItemClick = (index) => {
      currentIndex.value = index
      emit('tbChange', index)
    };
    return {
      currentIndex,
      tbItemClick,
    }
  },
}
</script>

<style scoped lang="scss">
  .tab-control{
    display: flex;
    justify-content: space-around;
    height: 40px;
    position: sticky;
    top: 40px;
    z-index: 30;
    background-color: var(--color-background);
    .tab-control-item{
      height: 40px;
      padding: 10px 12px;
    }
  }
  .active{
    border-bottom: #42b983 2px solid;
  }
</style>