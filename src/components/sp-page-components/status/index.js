/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class OrderStatus extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderType = () => {
    const { msg } = this.props
    if (msg === '订单已取消') {
      return 'warning'
    } else if (msg === '已完成') {
      return 'success'
    } else if (msg === '已处理') {
      return 'success'
    } else {
      return 'process'
    }
  }

  render() {
    const { msg } = this.props
    return (
      <View className='sp-page-order-status'>
        <Text className='text'>{msg}</Text>
        <Text className={classNames('background', this.renderType())}>{}</Text>
      </View>
    )
  }
}
