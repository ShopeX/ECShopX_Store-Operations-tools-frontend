/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import api from '@/api'
import { reject } from 'lodash'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { isIos, showToast } from '@/utils'

/**
 * 安卓端兼容webView 相关文档:
 * https://developers.weixin.qq.com/community/develop/doc/0004ac1eb98950c61c3b073985ec00?_at=1616587626673
 * https://blog.csdn.net/Gage__/article/details/105820461
 *  */

class QWSDK {
  static getQwsdk() {
    if (window.__qwsdk) return window.__qwsdk
    else {
      window.__qwsdk = new QWSDK()
    }
    return window.__qwsdk
  }
  constructor() {
    this.init()
  }
  set(key, val) {
    this[key] = val
    // 更新本地持久化
    // this.setImage('set')
    // // console.log('QWSDK.set', this)
  }
  getState() {
    const state = {}
    for (let i in this) {
      state[i] = this[i]
    }
    return state
  }
  // 写入SDK状态景象
  setImage(Scenes = '默认') {
    const stateImage = this.getState()
    // // console.log('写入SDK状态景象:Scenes', Scenes)
    Taro.setStorageSync('QWSDKImage', stateImage)
  }
  // 读取SDK状态景象
  getImage(Scenes = '默认') {
    const stateImage = Taro.getStorageSync('QWSDKImage')
    // // console.log('读取SDK状态景象:Scenes', Scenes)
    // // console.log('getImage', stateImage)
    if (stateImage) {
      for (let i in stateImage) {
        this[i] = this.set(i, stateImage[i])
      }
    } else {
      // console.log('本地无镜像记录')
    }
  }
  // 调用sdk状态

  // 清除持久化记录
  clearImage(Scenes = '默认') {
    // // console.log('清除持久化记录:Scenes', Scenes)
    Taro.removeStorageSync('QWSDKImage')
  }
  init() {
    this._isWebView = false
    this._url = ''
    this._isAndroid = !isIos()
  }
  async register({ url }) {
    // // console.log('QWSDK:register:url', url)
    // // console.log('QWSDK:register:webView-url', this._url)
    // // console.log('this._isWebView && this._isAndroid', this._isWebView, this._isAndroid)
    if (this._isWebView && this._isAndroid) url = this._url //location.href.split('#')[0]
    // console.log('QWSDK:register:post-url', url)
    const jssdkConfig = await api.auth.getQwJsSdkConfig({
      url
    })
    console.log('QWSDK:register:jssdkConfig2', jssdkConfig)

    const { appId, timestamp, nonceStr, signature } = jssdkConfig
    // eslint-disable-next-line no-undef
    wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，企业微信的corpID
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    })
    // wx.checkJsApi({
    //   jsApiList: ['scanQRCode', 'chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    //   success: function (res) {
    //     console.log('==res==', res)
    //     // 以键值对的形式返回，可用的api值true，不可用为false
    //     // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    //   }
    // })
    wx.ready(function (e) {
      console.log('wx sdk ready', e)
    })

    wx.error(function (res) {
      console.log('wx sdk error:', res)
      showToast(res.errMsg)
    })
  }
  scanQRCode() {
    const that = this
    that.set('_isRun', true)
    console.log('scanQRCode')
    return new Promise((resolve, reject) => {
      wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function (res) {
          console.log('scanQRCode:success:res', res)
          if (that._isWebView && that._isAndroid) {
          }
          if (res.errMsg == 'scanQRCode:ok') {
            resolve(res.resultStr)
          } else {
            reject(res)
          }
        },
        error: function (res) {
          console.log('scanQRCode:error:res', res)
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
          reject(res)
        }
      })
    })
  }
}

export default QWSDK.getQwsdk()
