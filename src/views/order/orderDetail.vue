<template>
  <nav-bar>
    <template v-slot:default>订单详情</template>
  </nav-bar>
  <div class="bk">
    <div class="odCon">
      <div class="odText">
        <span class="textSpan">订单状态：</span>{{ statusStr }}<br>
        <span class="textSpan">订单编号：</span>{{ list.order_no }}<br>
        <span class="textSpan">下单时间：</span>{{ list.created_at }}<br>
        <van-button type="primary" class="odTextB" v-if="list.status == 1" @click="goPay">去支付</van-button>
        <van-button type="primary" class="odTextB" v-if="list.status == 2" @click="goConfirm">确认订单</van-button>
      </div>
      <div class="odOther">
        <span class="textSpan">商品金额：</span><span style="color: red">￥{{ list.amount + '.00' }}</span><br>
        <span class="textSpan">配送方式：</span>普通快递<br>
        <van-card
            v-for="(item, index) in list.orderDetails.data"
            :key="index"
            :num="item.num"
            :price="item.price"
            :desc="item.goods.description"
            :title="item.goods.title"
            :thumb="item.goods.cover_url"
        />
      </div>
    </div>

    <van-popup v-model:show="showPay" :close-on-click-overlay="false" position="bottom" closeable @close="popClose"
               style="height: 25%;">
      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          支付宝二维码<br>
          <van-image width="150" height="150" :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
          微信二维码<br>
          <van-image width="150" height="150" :src="wechat" />
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>


</template>

<script>
import navBar from "@/components/common/navBar";
import { useRouter, useRoute } from 'vue-router';
import { getOrderDetail, payOrder, payOrderStatus, confirmOrder } from 'network/order';
import { reactive, toRefs, onMounted, computed } from 'vue';
import { Dialog, Toast } from 'vant'

export default {
  name: "orderDetail",
  setup(){
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      orderId:'',
      list: {
        orderDetails:{
          data:[]
        },
        status:0,
      },
      showPay:false,
      aliyun:'',
      wechat:'',
    })


    const statusStr = computed(()=>{
      let status = ['', '已下单', '已支付', '等待发货', '确认收货', '已过期'];
      return status[state.list.status];
    })

    const init = () =>{
      const {id} = route.query
      state.orderId = id
      getOrderDetail(state.orderId).then(res=>{
        state.list = res
      })
    }


    onMounted(()=>{
      init()
    })

    const goPay = ()=>{
      state.showPay = true

      payOrder(state.orderId, {type:'aliyun'}).then(res=>{
        state.aliyun = res.qr_code_url;
        state.wechat = res.qr_code_url;
      })

      const timer = setInterval(()=>{
        payOrderStatus(state.orderId).then(res=>{
          console.log('正在调用查询状态请求')
          if(res==2){
            clearInterval(timer)
            router.push({path:'orderDetail', query:{id:state.orderId}})
          }
        })
      },2000)
    }

    const popClose = ()=>{
      state.showPay = false
      router.go(0)
    }

    const goConfirm = () =>{
      Dialog.confirm({title:'是否确认订单'}).then(()=>{
        confirmOrder(state.orderId).then(res=>{
          Toast('订单已确认')
          init()
        })
      })

    }

    return {
      ...toRefs(state),
      statusStr,
      goPay,
      popClose,
      goConfirm,
    }
  },
  components:{
    navBar,
  }
}
</script>

<style scoped lang="scss">
.bk{
  background: #fafafa;
}
.textSpan{
  font-size: 17px;
  color: black;
}
.odCon{
  margin-top: 54px;
  .odText{
    padding: 12px 20px;
    line-height: 28px;
    border-bottom: solid 8px lightgray;
    .odTextB{
      width: 100%;
      margin: 12px 0;
    }
  }
  .odOther{
    padding: 20px 24px;
    line-height: 28px;
  }
}
</style>