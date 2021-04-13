<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户注册</template>
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
              v-model="name"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
              v-model="password_confirmation"
              type="password"
              name="密码"
              label="确认密码"
              placeholder="请再次确认密码"
              :rules="[{ required: true, message: '请再次确认密码' }]"
          />
          <van-field
              v-model="email"
              name="邮箱"
              label="邮箱"
              placeholder="请填写电子有邮箱"
              :rules="[{ required: true, message: '请填写电子有邮箱' }]"
          />

          <div class="login-direct" @click="loginDirect">
            已有账号，立即登录
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" color="#1989FA">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { reactive, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Toast, Notify} from "vant";
import { register } from 'network/user';
import { useStore } from 'vuex'

export default {
  name: "register",
  setup(){
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const loginInfo = reactive({
      name:'',
      password: '',
      password_confirmation: '',
      email: '',
    })


    const onSubmit = () =>{
      // 前端先进行一遍密码与验证密码的检验， 与后端无关
      if(loginInfo.password != loginInfo.password_confirmation){
        Notify({ type: 'danger', message: '两次输入密码不一致' });
      }else{
        // 通过密码检验放行，其他检验后台进行
        register(loginInfo).then(res=>{
          // console.log(res);
          if(res.status == 201){
            Toast.success('注册成功')
            // 注册成功直接在本地写入登录状态
            window.localStorage.setItem('token', res.access_token);
            // 更改状态管理的登录属性, 通过 store.commit() 提交到状态管理的 mutations 一遍vuex的状态变更管理
            store.commit('setIsLogin', true)
            // 注册成功后直接跳转回个人页
            setTimeout(()=>{
              router.push({path:'/profile'})
            },500)
          }
        })
      }
    }

    const loginDirect = ()=>{
      router.push({path:'/login'})
    }

    return{
      ...toRefs(loginInfo),
      onSubmit,
      loginDirect,
    }
  },
  components:{
    navBar,
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