/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

export default class AfterSaleTreatment extends PureComponent {
  constructor() {
    super()
  }
  componentDidMount() {}

  render() {
    return (
      <View className='cpn-AfterSaleMessage'>
        <View className='box'>
          <View className='status'>
            <View className='message'>待处理</View>
            <View className='tips'>等待商家处理</View>
          </View>
          <View className='icon iconfont icon-keai'></View>
        </View>
      </View>
    )
  }
}
