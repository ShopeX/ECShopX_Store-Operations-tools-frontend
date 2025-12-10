/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, Image } from '@tarojs/components'
import { SpFormItem, SpIconFooter, SpRemarkDrawer } from '@/components'
import { classNames } from '@/utils'
import './index.scss'
import { log } from 'loglevel'

export default class SpRemarkItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      remarkVisible: false
    }
  }

  //是否有备注
  hasRemark = () => {
    const { pageType, orderInfo } = this.props
    if (pageType === 'orderDetail' || pageType === 'afterSalesDetail') {
      return !!orderInfo.distributor_remark
    }
    return false
  }

  remarkContent = () => {
    const { pageType, orderInfo, label } = this.props
    if (label == '客户留言') {
      return orderInfo.remark
    } else {
      if (pageType === 'orderDetail' || pageType === 'afterSalesDetail') {
        return orderInfo.distributor_remark
      }
      return ''
    }
  }

  //关闭备注
  handleRemarkClose = () => {
    this.setState({
      remarkVisible: false
    })
  }

  //打开备注
  handleShowRemark = () => {
    this.setState({
      remarkVisible: true
    })
  }

  render() {
    const { remarkVisible } = this.state
    const { pageType, onRefresh = () => {}, orderInfo, label } = this.props
    return (
      <>
        {label == '客户留言' ? (
          <View className={classNames('sp-component-remark-item', 'box-shadow-common')}>
            <SpFormItem label={label} wrap className='remark-component'>
              <View>
                <View className='content'>{this.remarkContent()}</View>
              </View>
            </SpFormItem>
          </View>
        ) : (
          <View className={classNames('sp-component-remark-item', 'box-shadow-common')}>
            <SpFormItem label='商家备注' wrap={this.hasRemark()} className='remark-component'>
              {this.hasRemark() ? (
                <View>
                  <View className='content'>{this.remarkContent()}</View>
                  <SpIconFooter type='remark' onContentClick={this.handleShowRemark} />
                </View>
              ) : (
                <View onClick={this.handleShowRemark}>添加</View>
              )}
            </SpFormItem>

            <SpRemarkDrawer
              visible={remarkVisible}
              pageType={pageType}
              onRefresh={onRefresh}
              orderInfo={orderInfo}
              onClose={this.handleRemarkClose}
            />
          </View>
        )}
      </>
    )
  }
}
