<template>
  <div>
    <nav-bar>
      <template v-slot:default>图书索引</template>
    </nav-bar>
    <div class="main-con">
      <div class="top-con">
        <van-tabs v-model="activeName" @click="orderChange">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      <div class="bottom-con">
        <div class="book-index">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item v-for="(item, index) in categoryD" :title="item.name" :key="index">
              <van-sidebar v-model="activeKey">
                <van-sidebar-item v-for="(sub, index) in item.children" :title="sub.name" :key="index"
                                  @click="cidChange(sub.id)"/>
              </van-sidebar>
            </van-collapse-item>
          </van-collapse>

        </div>
          <div class="booklist">
            <div class="content">
              <van-card
                  v-for="(item,index) in showBooks" :key="index"
                  :num="item.sales"
                  @click="toD(item.id)"
                  :tag="item.comments_count > 0 ? '热门' : '新书'"
                  :price="item.price + '.00'"
                  :title="item.title"
                  :thumb="item.cover_url"
                  :lazy-load="true"
              />
            </div>
        </div>
      </div>
    </div>
    <back-top @bTop="toTop" v-show="isBackShow"></back-top>
  </div>
</template>

<script>
import navBar from "@/components/common/navBar";
import { ref, reactive, onMounted, toRefs, watchEffect, nextTick, computed } from 'vue'
import { getCategory, getCategoryBooks } from 'network/category'
import BScroll from "better-scroll";
import BackTop from 'components/common/BackTop'
import { useRouter } from 'vue-router'

export default {
  name: 'category',
  setup(){
    const activeName = ref()
    const activeKey = ref()
    let categoryD = ref([])
    const currentOrder = ref('sales')
    const currentCid = ref(0)
    const isBackShow = ref()
    const books = reactive({
      sales:{ page:1, list:[] },
      price:{ page:1, list:[] },
      comments_count:{ page:1, list:[] },
    })
    let bs = reactive({})
    const router = useRouter()



    // 封装获取所有图书信息方法
    const init = ()=>{
      getCategoryBooks('sales',currentCid.value).then(res=>{
        books.sales.list = res.goods.data
      })

      getCategoryBooks('price',currentCid.value).then(res=>{
        books.sales.list = res.goods.data
      })

      getCategoryBooks('comments_count',currentCid.value).then(res=>{
        books.sales.list = res.goods.data
      })

    }

    // 获取当前索引及排序方式下的商品数据
    const showBooks = computed(()=>{
      return books[currentOrder.value].list
    })

    onMounted(()=>{

      // 获取索引数据
      getCategory().then(res=>{
        categoryD.value = res.categories
      })

      // 挂载完成后一定要调用信息请求，否则其他方法无法获取所需数据，页面也就无法完整渲染
      init()

      // 初始化better-scroll
      bs = new BScroll(document.querySelector('.booklist'), {
        probeType: 3, // 0，1，2，3 只要屏幕滑动就出发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true,
      })


      // 触发滚动事件
      bs.on('scroll', (position)=>{
        isBackShow.value = (-position.y) > 200
      })

      // 触发上拉加载更多
      bs.on('pullingUp',()=>{
        console.log('触发上拉加载事件');
        // console.log(document.querySelector('.content').clientHeight);
        // 上拉加载事件触发，获取下一页商品数据
        let page = books[currentOrder.value].page + 1
        getCategoryBooks(currentOrder.value,currentCid.value, page).then(res=>{
          books[currentOrder.value].list.push(...res.goods.data)
          books[currentOrder.value].page += 1
        })

        // 调用完成上拉事件，如果不进行调用，上拉结束后数据会导入，但是无法下拉到新数据位置
        bs.finishPullUp()

        // 这里如果不重新计算高度，将会造成无法上拉的问题
        bs.refresh()

        console.log("当前类型:"+currentOrder.value+",当前页："+page);
      })

    })

    // 监听所有事件变化
    watchEffect(()=>{
      nextTick(()=>{
        bs && bs.refresh()
      })
    })

    const orderChange = (index) =>{
      let orderTypes = ['sales', 'price', 'comments_count']
      currentOrder.value = orderTypes[index]
      getCategoryBooks(currentOrder.value, currentCid.value).then(res=>{
        books[currentOrder.value].list = res.goods.data
      })
      nextTick(()=>{
        bs.refresh()
      })
    }
    const toTop = () => {
      // scrollTo滑动到指定位置
      // 参数  (x, y, 滑动完成时间)
      bs.scrollTo(0, 0, 500)
    }



    const cidChange = (id)=>{
      currentCid.value = id
      currentOrder.value = 'sales'
      console.log(currentOrder.value)
      init()
      nextTick(()=>{
        bs.refresh()
      })
    }

    const toD = (id) =>{
      router.push({path:'/detail',query: {id:id}})
    }

    return{
      activeName,
      activeKey,
      categoryD,
      cidChange,
      currentOrder,
      orderChange,
      showBooks,
      isBackShow,
      toTop,
      toD,
    }
  },
  components:{
    navBar,
    BackTop,
  }
};
</script>

<style scoped lang="scss">
.main-con{
  margin-top: 50px;

  .top-con{
    width: 70%;
    position: fixed;
    right: 0;
    top: 50px;
    height: 45px;
    z-index: 32;
  }
  .bottom-con{
    margin-top: 100px;
    .book-index{
      position: fixed;
      left: 0;
      top: 100px;
      width: 130px;
    }
    .booklist{
      margin-top: 8px;
      height: 100vh;
      position: absolute;
      top:100px;
      left:130px;
      right: 0;
    }
  }
}

</style>
