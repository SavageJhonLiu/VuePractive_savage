import {request} from 'network/request'

export function getCategory(){
    return request({
        url:'api/goods',
    })
}

export function getCategoryBooks(order='sales',cid=0,page=1){
    return request({
        url:'api/goods?category_id='+cid+'&page='+page+'$'+order+'=1'
    })
}