/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

//获取物流信息
export function getLogistics(params) {
  console.log(params)
  return req.get('/delivery/process/list', params)
}

// 获取快递公司
export function getCourierCompanyList() {
  return req.get('/trade/logistics/list')
}

// 修改物流信息
export function updateLogistics(orders_delivery_id, data) {
  return req.put(`/delivery/${orders_delivery_id}`, data)
}

//获取物流详情
export function getDeliveryList(params) {
  return req.get(`/delivery/lists`, params)
}
