import { createRouter, createWebHistory } from 'vue-router';
import { Notify } from 'vant'

const Home = () => import('../views/home/home');
const Cart = () => import('../views/cart/cart');
const Category = () => import('../views/category/category');
const Profile = () => import('../views/profile/profile');
const Details = () => import('../views/details/Details');
const Register = ()=> import('../views/profile/register');
const Login = ()=> import('../views/profile/loginIn');
const AddressList = ()=> import('../views/profile/address');
const AddressEdit = ()=> import('../views/profile/addressEdit');
const createOrder = ()=> import('../views/order/createOrder');
const order = ()=> import('../views/order/order');
const orderDetail = ()=> import('../views/order/orderDetail');

import store from '../store'

// 定义导航内容
const routes = [
  {
    // 定义导航路径
    path: '/',
    // 导航名称
    name: 'DefaultHome',
    // 组件名称
    component: Home,
    // 跳转导航位置时可传输部分信息
    meta: {
      title: '图书商城',
    },

  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '图书商城',
    },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: '购物车',
      isAuthRequired:true,
    },
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: '图书索引',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人中心',
      isAuthRequired:true,
    },
  },
  {
    path: '/addressList',
    name: 'addressList',
    component: AddressList,
    meta: {
      title: '地址管理',
      isAuthRequired:true,
    },
  },
  {
    path: '/addressEdit',
    name: 'addressEdit',
    component: AddressEdit,
    meta: {
      title: '地址编辑',
      isAuthRequired:true,
    },
  },
  {
    path: '/detail',
    name: 'Details',
    component: Details,
    meta: {
      title: '图书详情',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: '用户注册',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '用户登录',
    },
  },
  {
    path: '/createOrder',
    name: 'createOrder',
    component: createOrder,
    meta: {
      title: '订单预览',
      isAuthRequired:true
    },
  },
  {
    path: '/order',
    name: 'order',
    component: order,
    meta: {
      title: '我的订单',
      isAuthRequired:true,
    },
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: orderDetail,
    meta: {
      title: '订单详情',
      isAuthRequired:true,
    },
  },
];

// 创建router对象，定义浏览器历史模式并将route内容导入
const router = createRouter({
  // 设置浏览器历史模式
  history: createWebHistory(process.env.BASE_URL),
  // 导入routes内容
  routes,
});

// 创建全局导航守卫
router.beforeEach((to,from,next)=>{
  // 可以在这里检测登录状态
  // 通过meta数据的isAuthRequired属性以及状态管理的isLogin来检验需要登陆状态的位置的登录信息是否已经登陆
  if(to.meta.isAuthRequired && store.state.user.isLogin === false){
    Notify('您还没有登录')
    return next('/login')
  }else{
    next()
  }


  // 在全局导航首位进行浏览器标签名的更改
  document.title = to.meta.title
})


// 导出router对象
export default router;
