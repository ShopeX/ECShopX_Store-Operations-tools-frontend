/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

// 获取消息
export function getMessageList(params) {
  // console.log(123);
  return req.get('/order/message/new', params)
}

// 消息详情
export function getMessageDetail(params) {
  return req.get('/order/message/list', params)
}

// 清除已读消息
export function clearUnread(params) {
  return req.post('/order/message/update', params)
}
