/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, MatchMedia } from '@tarojs/components'
import { SpGoodItem, SpGoodPrice } from '@/components'
import HeaderInfo from './header'
import './index.scss'

export default class SpOrderItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //列表orderitem显示描述
  renderListDescTitle = () => {
    const {
      info: {
        app_info: {
          status_info: { main_status }
        },
        items
      }
    } = this.props

    const totalNum = items.reduce((total, current) => total + Number(current.num), 0)

    if (main_status === 'shipping') {
      return `实收款：`
    } else {
      return `共${totalNum}件商品 应收（含运费）：`
    }
  }

  //列表orderitem显示价格
  renderListDescPrice = () => {
    const {
      info: { point, total_fee }
    } = this.props
    //金额订单
    if (point == 0) {
      return <SpGoodPrice price={total_fee} />
      //积分订单
    } else if (total_fee == 0) {
      return <SpGoodPrice point={point} />
    } else {
      return <SpGoodPrice price={total_fee} point={point} />
    }
  }

  /**渲染list页面时的extra */
  renderListExtra = () => {
    const { info: orderInfo, pageType = 'orderList' } = this.props

    let returnNode

    if (pageType === 'orderList') {
      returnNode = (
        <View className='sp-order-item-extra-list'>
          <View className='distribution'>{orderInfo.app_info.delivery_type_msg}</View>
          <View className='desc'>
            <View className='desc-title'>{this.renderListDescTitle()}</View>
            <View className='desc-price'>{this.renderListDescPrice()}</View>
          </View>
        </View>
      )
    } else if (pageType === 'afterSalesList') {
      returnNode = (
        <View className='sp-order-item-extra-sales-list'>
          <View className='item'>
            <View className='start'>{`进度：${orderInfo?.app_info?.progress_msg}`}</View>
            <View className='end'>
              <SpGoodPrice
                size={24}
                bold
                price={orderInfo?.refund_fee}
                isSame
                prefix='应退总金额：'
              />
            </View>
          </View>
          <View className='item'>
            <View className='start grey'>{`订单号：${orderInfo?.order_id}`}</View>
            <View className='end'>
              <SpGoodPrice
                size={24}
                bold
                point={orderInfo?.refund_point}
                isSame
                prefix='应退总积分：'
              />
            </View>
          </View>
        </View>
      )
    }

    return returnNode
  }

  renderDeliveryerInfo = () => {
    const { info: orderInfo, pageType = 'orderList' } = this.props

    if (
      orderInfo.self_delivery_operator_id == '0' ||
      !orderInfo.self_delivery_operator_id ||
      pageType === 'afterSalesList'
    )
      return null

    return (
      <View className='delivery'>
        <View className='delivery-name'>配送员：{orderInfo.self_delivery_operator_name}</View>
        <View className='delivery-fee'>配送费：{orderInfo.self_delivery_fee / 100}元</View>
      </View>
    )
  }

  renderListFooter = () => {
    const { renderFooter, pageType = 'orderList' } = this.props

    let returnNode

    if (pageType === 'orderList' || pageType === 'afterSalesList') {
      returnNode = <View className='sp-order-item-footer'>{renderFooter}</View>
    }
    return returnNode
  }

  renderGoodAlias = () => {
    const { pageType = 'orderList' } = this.props

    if (pageType === 'orderList') {
      return 'items'
    } else if (pageType === 'afterSalesList') {
      return 'detail'
    }
  }

  render() {
    const { info, onGoodItemClick = () => {}, pageType } = this.props

    return (
      <View className='sp-order-item'>
        <View className='sp-order-item-header'>
          <HeaderInfo info={info} pageType={pageType} />
        </View>
        <View className='sp-order-item-body'>
          {info[this.renderGoodAlias()].map((goodItem, index) => (
            <SpGoodItem
              onClick={onGoodItemClick}
              goodInfo={goodItem}
              orderInfo={info}
              className='goodItem'
              key={index}
              pageType={pageType}
            />
          ))}
        </View>

        {this.renderListExtra()}

        {this.renderDeliveryerInfo()}

        {this.renderListFooter()}
      </View>
    )
  }
}
