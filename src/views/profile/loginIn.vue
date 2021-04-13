<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户登录</template>
    </nav-bar>

    <div class="main-con" style="text-align: center">
      <van-image

          width="300"
          height="150"
          src="https://cdn2.lmonkey.com/94f152aaa94d937ccf5de78f3fcac59f/3b6e32e7bc8145a283431f260c3c1d1a.png"
      />
      <div>
        <van-form @submit="onSubmit">
          <van-field
              v-model="email"
              name="邮箱"
              label="邮箱"
              placeholder="请填写电子有邮箱"
              :rules="[{ required: true, message: '请填写电子有邮箱' }]"
          />
          <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div class="login-direct" @click="toRegister">
            还没账号，去注册
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" color="#1989FA">登录</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { useRouter } from 'vue-router';
import { reactive, toRefs } from "vue";
import { useStore } from 'vuex';
import { login } from 'network/user';
import { Toast } from "vant";

export default {
  name: "loginIn",
  setup(){
    const router = useRouter()
    const store = useStore()
    const userInfo = reactive({
      email:'',
      password:'',
    })

    const toRegister = () =>{
      router.push({path:'/register'})
    }

    const onSubmit = ()=>{
      login(userInfo).then(res=>{
        console.log(res);
        // 用户登录后将登录状态记录到本地
        window.localStorage.setItem('token', res.access_token);
        // 更改状态管理的登录属性, 通过 store.commit() 提交到状态管理的 mutations 一遍vuex的状态变更管理
        store.commit('setIsLogin', true)
        // 弹出登录成功提示
        Toast.success('登录成功')
        // 重置表单值
        userInfo.password = ''
        userInfo.email = ''
        // 成功后跳转回个人页
        setTimeout(()=>{
          router.push({path:'/profile'})
          store.dispatch('updateCart')
        },500)
      })
    }

    return{
      toRegister,
      ...toRefs(userInfo),
      onSubmit,
    }
  },
  components:{
    navBar
  }
}
</script>

<style scoped lang="scss">
.main-con{
  margin-top: 80px;

  .login-direct{
    margin-top: 12px;
    color: #42bBaa;
  }
}
</style>