/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'
import { isFromWebapp } from '@/utils'

export function getAuthorizeUrl(params) {
  return req.get('/operator/workwechat/authorizeurl', params)
}

export function workwechatOauthLogin(params) {
  return req.post('/operator/workwechat/oauth/login', params)
}

export function bindMobile(params) {
  return req.post('/operator/workwechat/bind_mobile', params)
}

export function getQwJsSdkConfig(params) {
  if (isFromWebapp()) {
    return req.post('/operator/wechat/distributor/js/config', params)
  } else {
    return req.post('/workwechat/distributor/js/config', params)
  }
}
//获取图片验证码
export function getImageVerificationCode(params) {
  return req.get('/operator/app/image/code', params)
}
//获取手机验证码
export function getPhoneCode(params) {
  return req.post('/operator/app/sms/code', params)
}
