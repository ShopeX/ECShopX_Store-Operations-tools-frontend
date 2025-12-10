/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { requestCallback, qwsdk, isIos } from '@/utils'

const EntryPool = {
  //[MKT-1508] 导购小程序进入
  'MKT-1508': async function () {
    // 记录是webView访问;
    Taro.setStorageSync('isWebView', true)
  }
}
class Entry {
  static getEntry() {
    if (window.__Entry) return window.__Entry
    else {
      window.__Entry = new Entry()
    }
    return window.__Entry
  }
  constructor() {}
  init(taro, store) {
    this.__taro = taro
    this.__store = store
  }
  set(key, val) {
    this.EntryData[key] = val
  }
  get(key) {
    return this.EntryData[key]
  }
  runHooks(entryCode) {
    return EntryPool[entryCode].call(this)
  }
}
export default Entry.getEntry()
