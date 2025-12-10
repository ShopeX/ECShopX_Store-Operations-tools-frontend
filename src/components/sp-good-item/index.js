/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpGoodPrice } from '@/components'
import './index.scss'

class SpGoodItem extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderSalePrice = () => {
    const {
      orderInfo: { order_class },
      goodInfo,
      pageType
    } = this.props
    //如果是积分订单
    if (order_class === 'pointsmall') {
      if (pageType === 'afterSalesList') {
        return <SpGoodPrice type='normal' point={goodInfo?.orderItem?.item_point} />
      }
      return <SpGoodPrice type='normal' point={goodInfo.item_point} />
    } else {
      if (pageType === 'afterSalesList') {
        return <SpGoodPrice type='normal' price={goodInfo?.orderItem?.price} />
      } else if (pageType === 'afterSalesDetail') {
        return <SpGoodPrice type='normal' price={goodInfo?.orderItem?.price} />
      }
      return <SpGoodPrice price={goodInfo.price} />
    }
  }

  renderOriginPrice = () => {
    const {
      orderInfo: { order_class },
      goodInfo,
      pageType
    } = this.props
    //如果是积分订单
    if (order_class === 'pointsmall') {
      if (pageType === 'afterSalesList') {
        return <SpGoodPrice type='discount' point={goodInfo?.orderItem?.point} />
      }
      return <SpGoodPrice type='discount' point={goodInfo.point} />
    } else {
      if (pageType === 'afterSalesList') {
        return <SpGoodPrice type='discount' size={24} price={goodInfo?.orderItem?.market_price} />
      } else if (pageType === 'afterSalesDetail') {
        return <SpGoodPrice type='discount' size={24} price={goodInfo?.orderItem?.market_price} />
      }
      return <SpGoodPrice type='discount' size={24} price={goodInfo.market_price} />
    }
  }

  handleGoodClick = () => {
    const { onClick = () => {}, goodInfo } = this.props
    onClick(goodInfo)
  }

  renderNumberExtra = () => {
    const { pageType = 'orderList' } = this.props
    if (pageType === 'orderList' || pageType === 'afterSalesList') {
      return <Text className='number-prefix'>X</Text>
    } else {
      return '数量：'
    }
  }

  //渲染价格描述
  renderNumberDesc = () => {
    const { inputnumber, goodInfo, errorGoodIds } = this.props
    //是否应该显示错误
    let error = errorGoodIds.indexOf(goodInfo.item_id) > -1

    //如果是
    if (inputnumber === 0) {
      return <View className={classNames('no-number', { ['error']: error })}>请写发货数量</View>
    } else if (
      inputnumber !== 0 &&
      goodInfo.num - Number(goodInfo.delivery_item_num) >= inputnumber
    ) {
      return <View className='has-number'>{`部分发货：${inputnumber}`}</View>
    } else {
      return <View className='error-number'>{`部分发货：${inputnumber}`}</View>
    }
  }

  renderPic = () => {
    const { goodInfo, pageType } = this.props
    if (pageType === 'orderList') {
      return goodInfo?.pic
    } else if (pageType === 'orderDetail') {
      return goodInfo?.pic
    } else if (pageType === 'afterSalesList') {
      return goodInfo?.item_pic
    } else if (pageType === 'afterSalesDetail') {
      return goodInfo?.item_pic
    } else if (pageType === 'orderDelivery') {
      return goodInfo?.pic
    }
  }

  renderSpec = () => {
    const { goodInfo, pageType } = this.props
    if (pageType === 'afterSalesDetail') {
      return goodInfo?.orderItem?.item_spec_desc
    }
    return goodInfo.item_spec_desc
  }

  render() {
    const {
      goodInfo,
      className,
      renderInputNumber,
      onClickInputNumber = () => {},
      pageType
    } = this.props

    return (
      <View className={classNames('sp-good-item', className)} onClick={this.handleGoodClick}>
        <View className='sp-good-item-image'>
          <Image className='img' src={this.renderPic()} />
        </View>
        <View className='sp-good-item-content'>
          <View className='sp-good-item-content_name'>
            {goodInfo.is_prescription == 1 && <Text className='prescription-drug'>处方药</Text>}
            {goodInfo.item_name}
          </View>
          <View className='sp-good-item-content_spec'>{this.renderSpec()}</View>
          <View className='sp-good-item-content_number'>货号：{goodInfo.item_bn}</View>
        </View>
        <View
          className={classNames('sp-good-item-rightextra', {
            ['renderInputNumber']: renderInputNumber
          })}
        >
          {!renderInputNumber && (
            <View className='sp-good-item-rightextra-top'>
              <View className='sp-good-item-rightextra-price'>{this.renderSalePrice()}</View>
              <View className='sp-good-item-rightextra-originprice'>
                {this.renderOriginPrice()}
              </View>
            </View>
          )}
          {renderInputNumber && (
            <View
              className='sp-good-item-rightextra-inputnumber'
              onClick={() => onClickInputNumber(goodInfo.num)}
            >
              {this.renderNumberDesc()}
            </View>
          )}
          <View className='sp-good-item-rightextra-goodnumber'>
            {this.renderNumberExtra()}{' '}
            <Text className='number'>
              {pageType === 'orderDelivery' ? goodInfo.deliveryNum : goodInfo.num}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SpGoodItem
