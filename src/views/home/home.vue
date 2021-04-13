<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>首页</template>
    </nav-bar>
    <tab-control :titles="['畅销', '新书', '精选']" @tbChange="tbChangeOut" v-show="isTabFixed"></tab-control>
    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <homeSwiper :slides="swiper"></homeSwiper>
          <recommend-books :recommends="recommends"></recommend-books>
        </div>
        <tab-control :titles="['畅销', '新书', '精选']" @tbChange="tbChangeOut"></tab-control>
        <goods-list :goods="showGoodsData"></goods-list>
      </div>
    </div>
    <back-top @bTop="toTop" v-show="isBackShow"></back-top>
  </div>
</template>

<script>
import navBar from 'components/common/navBar.vue';
import BackTop from 'components/common/BackTop.vue'
import { ref, reactive, onMounted, computed, watchEffect, nextTick } from 'vue'
import { getHomeAllData, getHomeGoods } from 'network/home';
import homeSwiper from './homeChilds/homeSwiper'
import RecommendBooks from './homeChilds/RecommendBooks';
import tabControl from 'components/content/tabControl';
import GoodsList from 'components/content/goods/GoodsList';
import BScroll from 'better-scroll'

export default {
  name: 'home',
  setup() {
    const swiper = ref([])
    const recommends = ref([])
    const currentType = ref('sales')
    const goods = reactive({
      'sales': {list:[], page:1},
      'new': {list:[], page:1},
      'recommend': {list:[], page:1},
    })
    const showGoodsData = computed(()=>{
      // 注意currentType是通过ref定义的，需要只用currentType.value进行调用
      return goods[currentType.value].list
    })
    const isTabFixed = ref(false)
    const isBackShow = ref(false)
    let banref = ref(null)

    // 在外层生命bscroll对象, 以便在onMounted生命周期函数外调用
    let bs = reactive({})

    onMounted(() => {
      // 获取首页所有数据
      getHomeAllData().then(res=>{
        swiper.value = res.slides
        recommends.value = res.goods.data
      })

      // 获取不同分类首页图书信息
      getHomeGoods('sales').then(res=>{
        goods.sales.list = res.goods.data
      })
      getHomeGoods('new').then(res=>{
        goods.new.list = res.goods.data
      })
      getHomeGoods('recommend').then(res=>{
        goods.recommend.list = res.goods.data
      })

      // 初始化better-scroll
      bs = new BScroll(document.querySelector('.wrapper'), {
        probeType: 3, // 0，1，2，3 只要屏幕滑动就出发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true,
      })

      // 触发滚动事件
      bs.on('scroll', (position)=>{
        isTabFixed.value = -position.y > banref.value.offsetHeight
        isBackShow.value = isTabFixed.value
      })

      // 触发上拉加载更多
      bs.on('pullingUp',()=>{
        // console.log('触发上拉加载事件');
        // console.log(document.querySelector('.content').clientHeight);
        // 上拉加载事件触发，获取下一页商品数据
        let page = goods[currentType.value].page + 1
        getHomeGoods(currentType.value, page).then(res=>{
          goods[currentType.value].list.push(...res.goods.data)
          goods[currentType.value].page += 1
        })

        // 调用完成上拉事件，如果不进行调用，上拉结束后数据会导入，但是无法下拉到新数据位置
        bs.finishPullUp()

        // 这里如果不重新计算高度，将会造成无法上拉的问题
        bs.refresh()

        // console.log("当前类型:"+currentType.value+",当前页："+page);
      })

    })

    // 监听所有事件变化
    watchEffect(()=>{
      nextTick(()=>{
        bs && bs.refresh()
      })
    })

    const tbChangeOut = (index) => {
      let types = ['sales', 'new', 'recommend']
      currentType.value = types[index]
      // 索引标签切换，重新计算页面高度
      nextTick(()=>{
        bs.refresh()
      })
    }

    const toTop = () => {
      // scrollTo滑动到指定位置
      // 参数  (x, y, 滑动完成时间)
      bs.scrollTo(0, 0, 500)
    }

    return {
      swiper,
      recommends,
      tbChangeOut,
      goods,
      showGoodsData,
      isTabFixed,
      banref,
      toTop,
      isBackShow,
    }
  },
  components: {
    navBar,
    homeSwiper,
    RecommendBooks,
    tabControl,
    GoodsList,
    BackTop,
  },
};
</script>

<style scoped lang="scss">
#home{
  position: relative;
  height: 100vh;
}
.wrapper{
  position: absolute;
  bottom: 64px;
  left: 0;
  top: 48px;
  right: 0;
  overflow: hidden;
}
</style>
