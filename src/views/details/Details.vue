<template>
  <nav-bar>
    <template v-slot:default>图书详情</template>
  </nav-bar>

<!-- 图书图片位置 -->
  <van-image style="margin-top: 48px;"
      width="100%"
      lazy-load
      :src="detail.cover_url"
  />

<!-- 信息卡片部分 -->
  <van-card
      :num="detail.stock"
      :price="detail.price + '.00'"
      :desc="detail.description"
      :title="detail.title"
  >
    <template #tags>
      <van-tag plain type="danger">新书</van-tag>
      <van-tag plain type="danger">推荐</van-tag>
    </template>
    <template #footer>
      <van-button type="warning" @click="toCart(detail.id)">加入购物车</van-button>
      <van-button type="danger" @click="directPay">立即购买</van-button>
    </template>
  </van-card>

  <van-tabs v-model="activeName">
    <van-tab title="概述" name="a">
      <div class="gs" v-html="detail.details">

      </div>
    </van-tab>
    <van-tab title="热评" name="b"></van-tab>
    <van-tab title="相关图书" name="c">
      <GoodsList :goods="like_books">

      </GoodsList>
    </van-tab>
  </van-tabs>

</template>

<script>
import navBar from 'components/common/navBar';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { getDetails } from 'network/details';
import { useRoute, useRouter } from 'vue-router';
import tabControl from 'components/content/tabControl';
import GoodsList from 'components/content/goods/GoodsList';
import { addCart } from 'network/cart';
import { Toast } from 'vant';
import { useStore } from 'vuex';

export default {
  name: "Details",
  setup(){
    const route = useRoute()
    const store = useStore()
    const activeName = ref('a')
    const id = ref(0)
    let book = reactive({
      detail:{},
      like_books:[],
    })

    const toCart = (id)=>{
      addCart({goods_id: id,num:1}).then(res=>{
        if( res.status == 201 || res.status == 204 ){
          Toast.success('已添加')
          // 通过dispatch分发到状态管理的actions中，再在actions中提交给mutations，进行全局变量的更新
          store.dispatch('updateCart')
        }
      })
    }

    const directPay = ()=>{

    }

    onMounted(()=>{

      id.value = route.query.id

      getDetails(id.value).then(res=>{
        book.detail = res.goods
        book.like_books = res.like_goods
        console.log(book);
      })
    })
    return{
      ...toRefs(book),
      activeName,
      toCart,
      directPay,
    }
  },
  components:{
    navBar,
    tabControl,
    GoodsList,
  },
}
</script>

<style scoped>

</style>