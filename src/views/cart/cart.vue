<template>
  <div>
    <nav-bar>
      <template v-slot:default>购物车</template>
    </nav-bar>
    <div class="main-con">
      <van-checkbox-group v-model="result" v-if="list.length" @change="checkChange">
          <van-swipe-cell v-for="(item,index) in list" :key="index">

            <div class="bookItem">

              <van-checkbox :name="item.id"/>

              <div class="books-img">
                <img :src="item.goods.cover_url" alt="">
              </div>

              <div class="books-con">
                <div class="bcTop">
                  <span>{{ item.goods.title }}</span>
                </div>
                <div class="bcBottom">
                  <span style="color: red">￥{{ item.goods.price }}</span>
                  <span>
                    <van-stepper v-model="item.num" :name="item.id" async-change
                                 min="1" :max="item.goods.stock" @change="numChange"/>
                  </span>
                </div>
              </div>

            </div>

            <template #right>
              <van-button square style="height: 100%" text="删除" type="danger" class="delete-button" />
            </template>

          </van-swipe-cell>
      </van-checkbox-group>

      <van-submit-bar :price="totalPrice" button-text="提交订单" @submit="onSubmit" class="submitBar" v-if="list.length">
        <van-checkbox v-model="checkAll" @click="checkALL">全选</van-checkbox>
      </van-submit-bar>
      <div class="cartEmpty" v-if="!list.length">
        <img src="~assets/images/empty-car.png" alt="?">
        <div class="ecText">
          购物车空空如也
        </div>
        <van-button round color="#1baeae" type="primary" block @click="goSelect">前往选购</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { ref,reactive,toRefs,onMounted,computed } from 'vue';
import { getCart, modifyCart, checkedChange } from 'network/cart';
import { Toast } from "vant";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'cart',
  setup(){
    const itemValue = ref()
    const checked = ref()
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      list:[],
      result:[],
      checkAll:true,
    })

    // 封装获取数据初始化方法
    const init = ()=>{
      Toast.loading({message:'数据加载中', forbidClick:true})
      getCart('include=goods').then(res=>{
        state.list = res.data
        state.result = res.data.filter(n=>n.is_checked == 1).map(item=>item.id)
        if(state.result.length == state.list.length){
          state.checkAll = true
        }else{
          state.checkAll = false
        }
        Toast.clear()
      })
    }

    onMounted(()=>{
      init()
      store.dispatch('updateCart')
    })

    const totalPrice = computed(()=>{
      let sum = 0
      state.list.filter(item=>state.result.includes(item.id)).forEach(item=>{
        sum += parseInt(item.num) * parseFloat(item.goods.price) * 100
      })
      return sum
    })

    const onSubmit = () =>{
      if(state.result.length == 0){
        Toast('您还没有选择商品')
        return
      }else{
        router.push({path:'/createOrder'})
      }
    }

    const checkChange = (result)=>{
      if(state.result.length == state.list.length){
        state.checkAll = true
      }else{
        state.checkAll = false
      }

      // 变更服务器端购物车商品选中状态
      checkedChange({cart_ids:result})
    }

    const checkALL = ()=>{
      state.checkAll = !state.checkAll
      if(state.checkAll){
        state.result = []
      }else{
        state.result = state.list.map(item=>item.id)
      }
      checkedChange({cart_ids:state.result})
    }

    const numChange = (value, detail)=>{
      modifyCart(detail.name, {num: value}).then(res=>{
        Toast.loading({message: '正在变更', forbidClick:true})
        // 同时更新组件内元素， 重新渲染页面
        state.list.forEach(item=>{
          if(item.id == detail.name){
            item.num = value
          }
        })
        Toast.clear()
      })
    }

    const goSelect = () =>{
      router.push({path:'/'})
    }

    return{
      ...toRefs(state),
      itemValue,
      checked,
      onSubmit,
      goSelect,
      numChange,
      checkChange,
      checkALL,
      totalPrice,
    }
  },
  components:{
    navBar,
  }
};
</script>

<style scoped lang="scss">
.main-con{
  margin-top: 54px;
  padding: 8px 12px;
    .bookItem{
      display: flex;
    }
    .books-img{
      width: 100px;
    }
    .books-con{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
    }
  .bcTop{
    display: flex;
    justify-content: space-between;
    height: 28px;
    line-height: 28px;
  }
  .bcBottom{
    display: flex;
    justify-content: space-between;
    height: 28px;
    line-height: 28px;
  }
  .submitBar{
    margin-bottom: 64px;
  }
  .cartEmpty{
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .ecText{
      font-size: 20px;
      margin: 20px 0;
    }
  }

}
</style>
