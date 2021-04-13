<template>
  <nav-bar>
    <template v-slot:default>我的订单</template>
  </nav-bar>

  <div class="order-con">
    <van-tabs v-model="active" class="orderTabs" @click="tabChange">
      <van-tab title="全部"></van-tab>
      <van-tab title="待付款"></van-tab>
      <van-tab title="已支付"></van-tab>
      <van-tab title="发货"></van-tab>
      <van-tab title="交易完成"></van-tab>
    </van-tabs>

    <div class="content3">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="main-con2">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据了"
            @load="onLoad"
        >
          <div class="orderD" v-for="(item, index) in list" :key="index" @click="toD(item.id)">
            <div class="orderD-text">
              <span>订单号：{{ item.order_no }}</span><br>
              <span>创建时间：{{ item.updated_at }}</span>
            </div>
            <van-card
                class="orderD-card"
                v-for="(sub, index) in item.orderDetails.data"
                style="background: #ffffff"
                :key="index"
                :num="sub.num"
                :price="sub.price"
                :desc="sub.goods.description"
                :title="sub.goods.title"
                :thumb="sub.goods.cover_url"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { ref, toRefs, reactive, onMounted } from 'vue';
import { Toast } from 'vant';
import { getOrderList, getOrderDetail } from 'network/order';
import { useRouter } from 'vue-router'

export default {
  name: "order",
  setup(){
    const active = ref()
    const router = useRouter()
    const state = reactive({
      isLoading:false,
      finished:false,
      loading:false,
      page:1,
      status:0,
      list:[],
      totalPage:0,
    })

    // 定义标签点击事件
    const tabChange = (name)=>{
      // 该组件方法可以直接获取点击位置索引
      state.status = name
      onRefresh()
    }

    // 定义下拉刷新
    const onRefresh = ()=>{
      state.isLoading = true

      // 清理finished变量
      state.finished = false

      state.loading = true

      // 初始化页数属性 page
      state.page = 1

      // 调用加载事件
      onLoad()

    }

    const onLoad = ()=>{
      // 分别处理下拉刷新下的加载和非下拉刷新下的加载
      if(!state.isLoading && state.page < state.totalPage){
        state.page += 1
      }

      if(state.page >= state.totalPage){
        state.finished = true
      }

      if(state.isLoading){
        // 初始化list
        state.list = []
        // 提交加载事件结束
        state.isLoading = false
      }

      // 参数处理完成， 重新调用获取数据方法
      getData()
      state.loading = false
    }

    // 封装获取订单数据方法
    const getData = ()=> {
      // {page:1, status:2, include:'user,orderDetail.goods'}
      getOrderList({page: state.page, status: state.status, include: 'orderDetails.goods'}).then(res => {
        console.log(state);
        state.list = state.list.concat(res.data)
        //
        state.totalPage = res.meta.pagination.total_pages
        // 当订单刷新当前页数大于等于总页数时， 将finished的值设置为正，停止刷新更新事件的触发
        if (state.page >= state.totalPage) {
          state.finished = true
        }
      })
    }

    onMounted(()=>{
      // getData()
    })

    const toD = (id) =>{
      router.push({path:'/orderDetail', query: {id}})
    }

    return {
      ...toRefs(state),
      active,
      onRefresh,
      onLoad,
      getData,
      tabChange,
      toD,
    }
  },
  components:{
    navBar,
  }
}
</script>

<style scoped lang="scss">
.order-con{
  margin-top:48px;
  .orderTabs{
    width: 100%;
    position: fixed;
    top: 48px;
    left: 0;
    right: 0;
    z-index: 50;
  }

  .content3{
    padding-top: 60px;
    overflow: hidden;
    overflow-y: scroll;
    height: 100vh;
    .main-con2{
      .orderD{
        margin: 18px 16px;
        background: #fafafa;
        .orderD-text{
          padding: 8px 12px;
          line-height: 28px;
        }
      }
    }
    .orderD-card{
      padding: 0 8px;
    }
  }
}
</style>