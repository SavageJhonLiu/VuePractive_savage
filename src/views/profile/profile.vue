<template>
  <div>
    <nav-bar>
      <template v-slot:default>个人中心</template>
    </nav-bar>
    <div class="mainContent">
<!--      用户信息卡部分    -->
      <div class="user-info">
        <div class="info">
          <img src="~assets/images/user.png" alt="">
          <div class="user-desc">
            <span>昵称：{{ user.name }}</span>
            <span>邮箱：{{ user.email }}</span>
            <span class="name">个性签名：成就自己的只需一套精品</span>
          </div>
        </div>
<!--        个人中心导航区    -->
      <ul class="user-list">
        <li><span>我的收藏</span><van-icon name="arrow" /></li>
        <li @click="goTo('/order')"><span>我的订单</span><van-icon name="arrow" /></li>
        <li><span>账号管理</span><van-icon name="arrow" /></li>
        <li @click="goTo('/addressList')"><span>地址管理</span><van-icon name="arrow"/></li>
        <li><span>关于我们</span><van-icon name="arrow" /></li>
      </ul>

<!--        退出登录   -->
      <div style="margin: 16px;">
        <van-button round block  color="#42b983" @click="toLogout">退出登录</van-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { ref, reactive, toRefs } from 'vue';
import { getUserInfo, logOut } from 'network/user';
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'profile',
  setup(){
    const store = useStore()
    const router = useRouter()

    const userInfo = reactive({
      user:{},
    })

    getUserInfo().then(res=>{
      userInfo.user = res
    })

    const toLogout = () =>{
      logOut().then(res=>{
        if(res.status == '204'){
          Toast.success('退出成功')
          window.localStorage.setItem('token', '')
          store.commit('setIsLogin',false)
          setTimeout(()=>{
            router.push({path:'/login'})
          }, 500)
        }
      })
    }

    const goTo = (path,data)=>{
      router.push({path,query:data || {}})
    }

    return {
      ...toRefs(userInfo),
      toLogout,
      goTo,
    }
  },
  components:{
    navBar,
  }
};
</script>

<style scoped lang="scss">
.mainContent{
  margin-top: 100px;
  .user-info{
    width: 94%;
    margin: 10px;
    height: 115px;
    background: linear-gradient(90deg, #31c7A7, #A1c7c7);
    box-shadow: 0 2px 5px #269090;
    border-radius: 6px;
    margin-top: 50px;
    text-align: left;
    .info {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 25px 20px;
      img {
        width:60px;
        height:60px;
        border-radius: 50%;
        margin-top: 4px;
      }
      .user-desc {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;
        span {
          color: #fff;
          font-size: 14px;
          padding: 2px 0;
        }
      }
    }
    .user-list{
      margin-top: 20px;
      padding: 6px 12px;
      li{
        padding-left:5px;
        padding-right:5px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        // Vant组件可以通过组件名加name的类进行样式修改，大概
        .van-icon-arrow {
          margin-top: 13px;
        }
      }
    }
  }
}

</style>
