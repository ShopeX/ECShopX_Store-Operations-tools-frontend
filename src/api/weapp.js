/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

//查询是否绑定
export function is_bind(query) {
  return req.post('/operator/wechat/lite/login', query)
}

//查询主类目
export function main_category(query) {
  return req.get('/goods/category', {
    is_main_category: true
  })
}

//查询分类
export function category(query) {
  return req.get('/goods/category', {
    is_show: false,
    ...query
  })
}

//查询品牌
export function brand() {
  return req.get('/goods/attributes', {
    page: 1,
    pageSize: 1000,
    attribute_type: 'brand'
  })
}

//运费模版
export function template() {
  return req.get('/shipping/templates/list', {
    page: 1,
    pageSize: 1000
  })
}

//或者主类目详情
export function main_category_detail(id) {
  return req.get(`/goods/category/${id}`)
}

//商品列表
export function good_list(params) {
  return req.get(`/goods/items`, params)
}

//添加商品
export function good(params) {
  return req.post(`/goods/items`, params)
}

//上下架
// export function update_status(params){
//   return req.post(`/goods/items`,params)
// }

//查看商品详情
export function good_detail(id) {
  return req.get(`/goods/items/${id}`)
}

//编辑商品
export function edit_good({ id, ...params }) {
  return req.put(`/goods/items/${id}`, params)
}

//上下架
export function update_status(params) {
  return req.put(`/goods/itemstatusupdate`, params)
}

//删除接口
export function delete_good(id) {
  return req.delete(`/goods/items/${id}/response`)
}
