/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

export function getProtocol(params) {
  return req.get('/api/protocol', params)
}

//发送验证码
export function sendCode(params) {
  return req.post('/operator/app/sms/code', params)
}

export function smsLogin(params) {
  return req.get('/api/sms/login', params)
}

export function getUserInfo(params) {
  return req.get('/operator/getinfo', params)
}

//绑定手机号
export function bindPhone(params) {
  return req.post('/operator/workwechat/bind_mobile', params)
}

//绑定店铺
export function selectDistributor(params) {
  return req.post('/operator/select/distributor', params)
}
