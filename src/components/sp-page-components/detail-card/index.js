/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { classNames } from '@/utils'
import { OrderIcon } from '@/components/sp-page-components'
import { View } from '@tarojs/components'
import { afterSales } from '@/consts'
import './index.scss'

class DetailCard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderMainStatus = () => {
    const { status, pageType, detail } = this.props
    if (pageType === 'afterSalesDetail') {
      return afterSales.LIST_STATUS[detail?.aftersales_status + 1]
    }
    return status
  }

  renderSubStatus = () => {
    const { subStatus, pageType, detail } = this.props
    if (pageType === 'afterSalesDetail') {
      return detail?.app_info?.progress_msg
    }
    return subStatus
  }

  renderIcon = () => {
    const { iconClassName, pageType, detail } = this.props
    if (pageType === 'afterSalesDetail') {
      return detail?.progress
    }
    return iconClassName
  }

  render() {
    const { pageType } = this.props

    return (
      <View className={classNames('sp-page-detail-card')}>
        <View className='status'>
          <View className='main'>{this.renderMainStatus()}</View>
          <View className='sub'>{this.renderSubStatus()}</View>
        </View>
        <OrderIcon status={this.renderIcon()} className='icon' pageType={pageType} />
      </View>
    )
  }
}

export default DetailCard
