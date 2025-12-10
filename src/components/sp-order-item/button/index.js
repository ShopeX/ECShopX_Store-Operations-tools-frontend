/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class Button extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { className, type = 'default', children, onClick = () => {} } = this.props

    return (
      <View
        className={classNames('order-item-button', {
          [`type-${type}`]: type,
          className
        })}
        onClick={onClick}
      >
        {children}
      </View>
    )
  }
}
