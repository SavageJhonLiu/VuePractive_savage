<template>
  <nav-bar>
    <template v-slot:default>订单预览</template>
  </nav-bar>
  <div class="cOrder-con">

    <div class="address-wrap" v-if="address.length ==0">
      <div class="name" @click="addressAdd">
        没有地址信息
      </div>
      <div class="address">
        去添加一个吧
      </div>
      <van-icon class="arrow" name="arrow" @click="addressEdit"/>
    </div>

    <div class="address-wrap" v-if="address.length!=0">
      <div class="name" @click="goTo">
        <span>{{address.name}}</span>
        <span>{{address.phone}}</span>
      </div>
      <div class="address">
        {{address.province}} {{address.city}} {{address.county}} {{address.address}}
      </div>
      <van-icon class="arrow" name="arrow" @click="addressEdit(address.id)"/>
    </div>

    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{item.goods.title}}</span>
            <span>x{{item.num}}</span>
          </div>
          <div class="good-btn">
            <div class="price"><small>¥</small> {{item.goods.price+'.00'}}</div>
          </div>
        </div>
      </div>
    </div>

    <van-submit-bar style="margin-bottom: 64px" :price="totalPrice" button-text="提交订单" @submit="onSubmit" />


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
import { reactive, toRefs, onMounted, computed } from 'vue';
import { getOrderPreview, createOrder, payOrder, payOrderStatus } from 'network/order';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useStore } from 'vuex'

export default {
  name: "createOrder",
  setup(){
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      address:{},
      cartList:[],
      showPay:false,
      orderNo:'',
      aliyun:'',
      wechat:'',
    })

    const init = () => {
      getOrderPreview().then(res=>{

        let defaultAddress =  res.address.filter(item=>item.is_default == 1)
        if(defaultAddress.length > 0){
          state.address = defaultAddress[0]
        }else{
          state.address = res.address[0]
        }
        state.cartList = res.carts
      })
    }



    onMounted(()=>{

      init()


    })
    const addressAdd = ()=>{
      router.push({path:'/addressEdit', query:{type:'add'}})
    }

    const addressEdit = (item)=>{
      router.push({path:'/addressEdit', query:{type:'edit',addressId:item}})
    }

    const onSubmit = ()=>{
      const params = {
        address_id:state.address.id
      }

      createOrder(params).then(res=>{
        Toast.success('创建订单成功')
        // 创建订单成功后， 更新状态管理的购物车数量信息
        store.dispatch('updateCart')

        state.showPay = true
        state.orderNo = res.id

        payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url;
        })

        const timer = setInterval(()=>{
          payOrderStatus(state.orderNo).then(res=>{
            if(res==2){
              clearInterval(timer)
              router.push({path:'orderDetail', query:{id:state.orderNo}})
            }
          })
        },20000)
      })
    }

    const popClose = ()=>{
      router.push({path:'/orderdetail', query:{id:state.orderNo}})
    }

    const onEdit = ()=>{

    }

    const totalPrice = computed(()=>{
      let sum = 0
      console.log(state.cartList);
      state.cartList.forEach(item=>{
        sum += parseInt(item.num) * parseFloat(item.goods.price) * 100
      })
      return sum
    })


    return{
      ...toRefs(state),
      onEdit,
      onSubmit,
      totalPrice,
      addressAdd,
      addressEdit,
      popClose,
    }
  },
  components:{
    navBar,
  }
}
</script>

<style scoped lang="scss">
.cOrder-con{
  margin-top: 52px;
  background: #f9f9f9;
  .address-wrap {
    text-align: left;
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    margin-top: 44px;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name, .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 80px;
      content: '';
    }
  }
  .good {
    margin-bottom: 120px;
  }
  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        width:100px;
        height:auto;
      }
    }
    .good-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;
      .good-title {
        display: flex;
        justify-content: space-between;
      }
      .good-btn {
        display: flex;
        justify-content: space-between;
        .price {
          font-size: 16px;
          color: red;
          line-height: 28px;
        }
        .van-icon-delete {
          font-size: 20px;
          margin-top: 4px;
        }
      }
    }
  }
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    >div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}

</style>