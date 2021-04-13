<template>
  <router-view/>
  <div class="bot-bar">
    <router-link class="tab-bar-item" to="/">
      <div class="text-before"><i class="iconfont iconshouye"></i></div>
      <div class="nav-text">首页</div>
    </router-link>
    <router-link class="tab-bar-item" to="/category">
      <div class="text-before"><i class="iconfont iconsuoyin"></i></div>
      <div class="nav-text">分类</div>
    </router-link>
    <router-link class="tab-bar-item" to="/cart">
      <div class="text-before">
        <van-badge :content="$store.state.cartCount" max="9">
          <i class="iconfont icongouwuche"></i>
        </van-badge>
      </div>
      <div class="nav-text">购物车</div>
    </router-link>
    <router-link class="tab-bar-item" to="/profile">
      <div class="text-before"><i class="iconfont iconprofile"></i></div>
      <div class="nav-text">我的</div>
    </router-link>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default {
  setup(){
    const store = useStore()

    onMounted(()=>{
      // DOM元素挂载完成后调用 updateCart 实时更新购物车商品数量
      store.dispatch('updateCart')
    })

  }
};
</script>

<style lang="scss">
@import 'assets/css/base.css';
@import 'assets/font/iconfont.css';

.bot-bar{
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #F6F6F6;
  display: flex;
  .tab-bar-item{
    flex:1;
    height: 54px;
    line-height: 54px;
    text-align: center;
  }
  .text-before{
    padding-top: 10px;
    height: 30px;
    line-height: 30px;
    .iconfont{
      font-size: 30px;
      font-weight: bold;
    }
  }
  .nav-text{
    padding-top: 14px;
    line-height: 15px;
    font-size: 12px;
  }
}
</style>
