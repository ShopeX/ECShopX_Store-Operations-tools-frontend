/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

//订单列表
export function list(params) {
  return req.get('/aftersales', params)
}

//售后详情
export function detail(params) {
  return req.get(`/aftersales/${params.no}`)
}

//售后审核
export function review(params) {
  return req.post(`/aftersales/review`, params)
}

//确认收货
export function confirm(params) {
  return req.post(`/aftersales/refundCheck`, params)
}

//售后地址
export function address(params) {
  return req.get(`/distributors/aftersalesaddress`, params)
}

//售后列表添加备注功能
export function remark(params) {
  return req.put(`/aftersales/remark`, params)
}
