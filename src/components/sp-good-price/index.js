/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import Taro from '@tarojs/taro'
import './index.scss'

/**
 * 1.type 存在normal/discount 表示折扣与非折扣
 * 2.price 表示价格
 * 3.point 表示显示积分 如果值不为空则此时为积分商品
 * 4.pointText 接受pointText表示积分的别名
 * 5.symbol 表示价格的单位
 * 6.isSame 表示分子分母大小写是否保持一致
 * 7.prefix 是否需要加前缀 如 + -
 */
class SpGoodPrice extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderNoPricePoint = () => {
    return this.renderPrice(true)
  }

  renderPrice = (isNone) => {
    const { price, point, symbol = '¥', isSame, color, type } = this.props

    const priceArr = (Number(price) / 100).toFixed(2).split('.')

    if (isNone && point == 0) {
      return 0
    }

    return (
      <View
        className={classNames('price', {
          ['is-same']: isSame,
          ['color-red']: color
        })}
      >
        {symbol}
        <View className='integer'>{isNone ? '0.' : `${priceArr[0]}.`}</View>
        {isNone ? '00' : `${priceArr[1]}`}
        {type === 'discount' && <View className='underline'></View>}
      </View>
    )
  }

  renderPoint = () => {
    const { point, pointText = '积分', type } = this.props

    return (
      <View className='point'>
        <View className='number'>{point}</View>
        <View className='symbol'>{pointText}</View>
        {type === 'discount' && <View className='underline'></View>}
      </View>
    )
  }

  renderPricePoint = () => {
    return (
      <View className='pointandprice'>
        {this.renderPoint()}
        {' + '}
        {this.renderPrice()}
      </View>
    )
  }

  render() {
    const { className, type = 'normal', bold, price, size = '28', point, prefix } = this.props

    const isDiscount = type === 'discount'

    return (
      <View
        className={classNames('sp-good-item-price', className, {
          [`discount`]: isDiscount,
          ['bold']: bold
        })}
        style={{
          fontSize: Taro.pxTransform(size)
        }}
      >
        {prefix && <View className='prefix'>{prefix}</View>}
        {!!price && !point && this.renderPrice()}
        {!!point && !price && this.renderPoint()}
        {!!point && !!price && this.renderPricePoint()}
        {!point && !price && this.renderNoPricePoint()}
      </View>
    )
  }
}

export default SpGoodPrice
