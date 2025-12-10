/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { copyContent } from '@/utils'
import { OrderStatus } from '@/components/sp-page-components'

export default class No extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderNo = () => {
    const { info, pageType } = this.props
    console.log(666, info)
    if (pageType === 'orderList') {
      return info.order_id
    } else if (pageType === 'afterSalesList') {
      return info.aftersales_bn
    }
  }

  handleCopy = () => {
    const { info, pageType } = this.props
    if (pageType === 'orderList') {
      copyContent(info.order_id)
    } else if (pageType === 'afterSalesList') {
      copyContent(info.aftersales_bn)
    }
  }

  renderStatus = () => {
    const { info, pageType } = this.props
    if (pageType === 'orderList') {
      return info?.app_info?.list_status_mag
    } else if (pageType === 'afterSalesList') {
      return info?.app_info?.status_msg
    }
  }

  renderDate = () => {
    const { info, pageType } = this.props
    if (pageType === 'orderList') {
      return info?.create_date
    } else if (pageType === 'afterSalesList') {
      return info?.app_info?.create_date
    }
  }

  renderTag = () => {
    const { info, pageType } = this.props
    if (pageType === 'orderList') {
      if (info.receipt_type == 'merchant') {
        return <View className='merchant-tag'>商家自配送</View>
      }
      return null
    } else if (pageType === 'afterSalesList') {
      if (info?.app_info?.order_info?.receipt_type == 'merchant') {
        return <View className='merchant-tag'>商家自配送</View>
      }
      return null
    }
  }

  render() {
    const { info } = this.props
    return (
      <View className='order-header'>
        <View className='order-no'>
          {this.renderTag()}
          <Text className='no'>{this.renderNo()}</Text>
          <Text className='copy' onClick={this.handleCopy}>
            复制
          </Text>
        </View>
        <View className='order-time'>{this.renderDate()}</View>

        <OrderStatus msg={this.renderStatus()} />
      </View>
    )
  }
}
