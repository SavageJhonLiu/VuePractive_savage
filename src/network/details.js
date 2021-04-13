import {request} from './request.js'

export function getDetails(id){
    return request({
        url:'api/goods/' + id
    })
}