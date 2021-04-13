import { request } from './request'

// 获取购物车数据
export function getCart(data=''){
    return request({
        url:'/api/carts?' + data
    })
}

// 添加商品到购物车
export function addCart(data){
    return request({
        url:'/api/carts',
        method:'post',
        data
    })
}

export function modifyCart(id, data){
    return request({
        url:`/api/carts/${id}`,
        method:'put',
        data
    })
}

export function checkedChange(data){
    return request({
        url:'/api/carts/checked',
        method: 'patch',
        data
    })
}