import { request } from 'network/request'

export function register(data){
    return request({
        url:'api/auth/register',
        method:'post',
        data
    })
}

export function login(data){
    return request({
        url:'/api/auth/login',
        method:'post',
        data
    })
}

export function getUserInfo(){
    return request({
        url:'/api/user',
    })
}

export function logOut(){
    return request({
        url:'/api/auth/logout',
        method:'post',
    })
}