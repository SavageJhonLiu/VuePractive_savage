import { getCart } from 'network/cart'

const actions = {
    updateCart({commit}) {
        // 请求当前用户购物车数据，获取购物车商品信息
        getCart().then(res=>{
            commit('addCart', {count:res.data.length || 0 })
        })
    }
}

export default actions