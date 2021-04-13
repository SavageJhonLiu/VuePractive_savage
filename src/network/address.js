import {request} from './request'

export function getAddress(){
    return request({
        url:'/api/address',
    })
}

export function addressAdd(params){
    return request({
        url:'/api/address',
        method:'post',
        params
    })
}

export function getAddressDetail(id){
    return request({
        url:`api/address/${id}`
    })
}

export function addressEdit(id, params){
    return request({
        url:`/api/address/${id}`,
        method:'put',
        params
    })
}

export function addressDelete(id){
    return request({
        url:`/api/address/${id}`,
        method:'delete',
    })
}