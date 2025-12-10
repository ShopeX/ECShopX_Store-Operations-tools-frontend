/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

class FixedAction extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  isDetail = () => {
    const { pageType } = this.props
    if (pageType === 'orderDetail' || pageType === 'afterSalesDetail') {
      return true
    }
    return false
  }

  render() {
    const { className, children } = this.props

    return (
      <View
        className={classNames('sp-page-fixed-action', className, {
          ['detail-page']: this.isDetail()
        })}
      >
        {children}
      </View>
    )
  }
}
export default FixedAction
