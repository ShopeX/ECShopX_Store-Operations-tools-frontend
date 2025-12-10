/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { msg } = this.props
    return (
      <View className='cpn-tips'>
        <Text>{msg}</Text>
      </View>
    )
  }
}
