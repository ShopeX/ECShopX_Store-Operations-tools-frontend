/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import S from '@/spx'
import Entry from '@/utils/entry'
import { SpLoading } from '@/components'
import { isIos } from '@/utils'

export default class LandingIndex extends Component {
  router = getCurrentInstance()
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    Taro.setStorageSync('isWebView', true)
    ;(!isIos() && Taro.setStorageSync('wxConfigSignUrl', location.href.split('#')[0])) ||
      Taro.setStorageSync('wxConfigSignUrl', '')
    let _params = this.router.params || getCurrentInstance().router.params

    console.log('原始路径：', this.router)
    console.log('原始路径：_params', _params)

    // Entry.runHooks()
    // 处理转义字符
    // let params = {}
    // for (let _key in _params) {
    //   let key = _key.replace(/amp;/g, '')
    //   params[key] = _params[_key]
    // }

    console.log('landing willmount')
    // console.log(params)
  }

  componentDidShow() {}

  componentWillUnmount() {
    this.setState({
      loading: false
    })
  }
  render() {
    const { loading } = this.state
    return <View>{loading && <SpLoading>正在加载...</SpLoading>}</View>
  }
}
