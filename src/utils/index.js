/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import classNames from 'classnames'
import styleNames from 'stylenames'
import qs from 'qs'
import S from '@/spx'
import _pickBy from 'lodash/pickBy'
import _get from 'lodash/get'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import log from './log'
import defaultTheme from './theme'
import validate from './validate'
import qwsdk from './qwsdk'

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function isFunction(val) {
  return isPrimitiveType(val, '[object Function]')
}
export function isString(val) {
  return isPrimitiveType(val, '[object String]')
}
export function isNumber(val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isArray(val) {
  return isPrimitiveType(val, '[object Array]')
}

export function isObject(val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isUndefined(val) {
  return isPrimitiveType(val, '[object Undefined]')
}

export const VERSION_STANDARD = process.env.APP_PLATFORM == 'standard'
// exc
export const VERSION_PLATFORM = process.env.APP_PLATFORM == 'platform'

export function transformData(data, obj) {
  let list = []
  data.forEach((item) => {
    let currentItem = {}
    for (let key in obj) {
      currentItem[obj[key]] = item[key]
    }
    if (item.children) {
      currentItem.children = transformData(item.children, obj)
    }
    list.push(currentItem)
  })
  return list
}

export function navigateTo(url, isRedirect) {
  if (isObject(isRedirect)) {
    isRedirect = false
  }
  if (isRedirect) {
    return Taro.redirectTo({ url })
  }
  return Taro.navigateTo({ url })
}

export function getCurrentRoute() {
  const { path, params: origParams } = getCurrentInstance().router
  const params = _pickBy(origParams, (val) => val !== '')
  const fullPath = `${path}${Object.keys(params).length > 0 ? '?' + qs.stringify(params) : ''}`
  return {
    path,
    fullPath,
    params
  }
}
//设置微信
export function setWeapp() {
  const { params: webappParams } = getCurrentInstance().router || { params: {} }
  console.log('===setWeapp', webappParams)
  if (webappParams && webappParams.in_shop_wechat) {
    S.set('WEBAPP', webappParams, true)
  }
}
//清除信息
export function cleanWeapp() {
  S.delete('WEBAPP', true)
  S.logout()
}
/** 判断是否从webapp跳转而来 */
export function isFromWebapp() {
  const webappParams = S.get('WEBAPP', true)
  return webappParams.in_shop_wechat === 'true'
}

export function getThemeStyle() {
  let systemTheme = S.get('SYSTEM_THEME')
  if (!systemTheme) {
    systemTheme = {
      ...defaultTheme
    }
  }
  const { colorPrimary, colorSecondary, colorText } = systemTheme
  return {
    '--color-primary': colorPrimary,
    '--color-senondary': colorSecondary,
    '--color-text': colorText
  }
}
// 格式化金钱
export function formatNum(number) {
  return number.toFixed(2).toLocaleString()
}
// 时间戳转日期格式
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var YY = date.getFullYear() + '-'
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return YY + MM + DD + ' ' + hh + mm + ss
}

// 计算字符长度 一个中文算两个字符
export function strLength(val) {
  var len = 0
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2
    } else {
      len += 1
    }
  }
  return len
}

export function showToast(title) {
  S.toast(title)
  // Taro.showToast({
  //   title,
  //   icon: 'none'
  // })
}

// 复制到粘贴板
export function copyContent(content) {
  Taro.setClipboardData({
    data: content,
    success: () => {
      Taro.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 1500
      })
    }
  })
}

async function requestCallback(
  func,
  successText,
  successCallback = () => {},
  failCallback = () => {}
) {
  let result = 1

  let res

  try {
    res = await func()
    if (res && successText) {
      S.toast(successText)
    }
  } catch (e) {
    console.log('请求错误', e)
    result = 0
  }

  if (result !== 0) {
    successCallback(res)
  }

  if (result == 0) {
    failCallback()
  }
}

function range(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

function calcTimer(totalSec) {
  let remainingSec = totalSec
  const dd = Math.floor(totalSec / 24 / 3600)
  remainingSec -= dd * 3600 * 24
  const hh = Math.floor(remainingSec / 3600)
  remainingSec -= hh * 3600
  const mm = Math.floor(remainingSec / 60)
  remainingSec -= mm * 60
  const ss = Math.floor(remainingSec)

  return {
    dd,
    hh,
    mm,
    ss
  }
}

function isIos() {
  if (
    /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) &&
    !/(wechatdevtools|webdebugger)/i.test(navigator.userAgent)
  ) {
    return true
  } else {
    return false
  }
}

function toFixed(total, number = 2, divisor = 100) {
  return (Number(total) / divisor).toFixed(number)
}

function isNull(value) {
  console.log('isNull', value, !value && value !== 0)
  return !value && value !== 0
}

//依次按顺序执行一些函数
function createChainedFunction(...funcs) {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) {
        return acc
      }
      return function chainedFunction(...args) {
        acc.apply(this, args)
        func.apply(this, args)
      }
    },
    () => {}
  )
}
export function pickBy(arr = [], keyMaps = {}) {
  const picker = (item) => {
    const ret = {}

    Object.keys(keyMaps).forEach((key) => {
      const val = keyMaps[key]

      if (isString(val)) {
        ret[key] = _get(item, val)
      } else if (isFunction(val)) {
        ret[key] = val(item)
      } else if (isObject(val)) {
        ret[key] = _get(item, val.key) || val.default
      } else {
        ret[key] = val
      }
    })

    return ret
  }

  if (isArray(arr)) {
    return arr.map(picker)
  } else {
    return picker(arr)
  }
}
function hundred(number) {
  return parseInt(Number(number) * 100)
}
/** 在支付宝平台 */
export const isAlipay = Taro.getEnv() == Taro.ENV_TYPE.ALIPAY

/** 在微信平台 */
export const isWeixin = Taro.getEnv() == Taro.ENV_TYPE.WEAPP

/** 在H5平台 */
export const isWeb = true

export * from './sku'
export {
  classNames,
  log,
  debounce,
  throttle,
  validate,
  requestCallback,
  range,
  calcTimer,
  qwsdk,
  isIos,
  toFixed,
  isNull,
  hundred,
  createChainedFunction
}
