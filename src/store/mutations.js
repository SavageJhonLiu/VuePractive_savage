const mutations = {
    // 编辑全局变量 state.user.isLogin 以便管理登陆状态信息
    setIsLogin(state, payload){
        state.user.isLogin = payload
    },
    addCart(state, payload){
        state.cartCount = payload.count
    },
}

export default mutations