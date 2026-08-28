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
    this._isRun = false
  }

  /** 安卓可能返回 "QR_CODE,内容" / "CODE_128,内容"，统一取码内容 */
  normalizeScanResult(raw) {
    if (raw == null) return ''
    const text = String(raw).trim()
    if (!text) return ''
    if (/^[A-Z0-9_]{2,32},.+/.test(text)) {
      return text.substring(text.indexOf(',') + 1)
    }
    return text
  }

  async register({ url }) {
    // 安卓扫码返回页时会触发 componentDidShow → 再次 register，
    // 新的 wx.config 会打断尚未结束的 scanQRCode 回调，导致扫完无反应
    if (this._isRun) {
      console.log('QWSDK:register: skip while scanning')
      return
    }
    // // console.log('QWSDK:register:url', url)
    // // console.log('QWSDK:register:webView-url', this._url)
    // // console.log('this._isWebView && this._isAndroid', this._isWebView, this._isAndroid)
    if (this._isWebView && this._isAndroid) url = this._url //location.href.split('#')[0]
    // console.log('QWSDK:register:post-url', url)
    let jssdkConfig
    try {
      jssdkConfig = await api.auth.getQwJsSdkConfig({
        url
      })
    } catch (e) {
      console.warn('QWSDK:register: 获取 jssdk 配置失败', e)
      return
    }
    console.log('QWSDK:register:jssdkConfig2', jssdkConfig)

    if (!jssdkConfig?.appId) {
      console.warn(
        'QWSDK:register: jssdk 配置无效，请检查 .env 中 APP_BASE_URL 是否已配置，以及是否已登录'
      )
      return
    }

    // 扫码过程中接口返回，仍跳过 config，避免打断回调
    if (this._isRun) {
      console.log('QWSDK:register: skip config while scanning')
      return
    }

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
      // showToast(res.errMsg)
    })
  }
  scanQRCode() {
    const that = this
    that.set('_isRun', true)
    console.log('scanQRCode')
    if (typeof wx === 'undefined' || !wx.scanQRCode) {
      that.set('_isRun', false)
      return Promise.reject(new Error('当前环境不支持企微扫码，请在企业微信内打开'))
    }
    return new Promise((resolve, reject) => {
      let settled = false
      const done = (fn, value) => {
        if (settled) return
        settled = true
        clearTimeout(safetyTimer)
        that.set('_isRun', false)
        fn(value)
      }
      // 部分安卓机扫码窗关闭后不回调，避免 _isRun 永久卡住后续 register
      const safetyTimer = setTimeout(() => {
        console.warn('scanQRCode: safety timeout')
        done(reject, { errMsg: 'scanQRCode:timeout' })
      }, 90000)

      wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function (res) {
          console.log('scanQRCode:success:res', res)
          const raw = res?.resultStr || res?.result || ''
          const ok = !res?.errMsg || String(res.errMsg).indexOf('scanQRCode:ok') !== -1
          // 安卓 WebView：先落盘，防止页面刷新后丢失结果
          if (that._isAndroid && raw) {
            try {
              Taro.setStorageSync('QWSDK_SCAN_RESULT', raw)
            } catch (e) {}
          }
          const finish = () => {
            if (!ok && !raw) {
              done(reject, res)
              return
            }
            const code = that.normalizeScanResult(raw)
            try {
              Taro.removeStorageSync('QWSDK_SCAN_RESULT')
            } catch (e) {}
            done(resolve, code)
          }
          // 安卓上同步处理 success 业务逻辑偶发不执行，延迟交付结果
          if (that._isAndroid) {
            setTimeout(finish, 300)
          } else {
            finish()
          }
        },
        fail: function (res) {
          console.log('scanQRCode:fail:res', res)
          done(reject, res)
        },
        error: function (res) {
          console.log('scanQRCode:error:res', res)
          if (res?.errMsg && res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
          done(reject, res)
        },
        cancel: function (res) {
          console.log('scanQRCode:cancel:res', res)
          done(reject, res || { errMsg: 'scanQRCode:cancel' })
        }
      })
    })
  }
}

export default QWSDK.getQwsdk()
