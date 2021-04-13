import axios from 'axios';
import {Toast, Notify} from 'vant';
import router from '../router'

export function request(config){
  const instance = axios.create({
    // 定义跟路由
    baseURL : 'https://api.shop.eduwork.cn',
    // 定义最大响应时间
    timeout : 5000
  })

  // 定义请求拦截内容
  instance.interceptors.request.use(config=>{
    // 如果有部分接口需要统一验证，则在此处直接进行拦截验证
    const token = window.localStorage.getItem('token')
    if(token){
      // 如果用户信息存在，则在请求头添加相应验证信息以获取相应需要权限用户数据
      config.headers.Authorization = 'Bearer' + token
    }
    // 通过返回  config  完成放行
    return config
  } , err=>{
    // 错误捕获和处理操作定义位置
  })

  // 定义响应拦截内容
  instance.interceptors.response.use(res=>{
    // 可以在这里对相应内容做一些统一处理， 比如以下
    // 如果相应结果中有 data 数据，则直接返回响应结果中的 data 数据，否则返回res
    // 这一步的目的是在调用时可以直接通过响应结果调用，而不是再通过 res.data 进行调用
    return res.data ? res.data : res
  }, err=>{
    // 可以通过相应拦截的错误捕获再次进行一些信息的验证
    if(err.response.status == '401'){
      Toast.fail('请先登录')
      router.push({path:'/login'})
    }
    // 根据路由说明文档， 针对不同的错误状态码进行相应的处理
    // 如果有错误，这里面会去处理，显示错误信息
    Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])

  })

  // 返回instance对象
  return instance(config)
}
