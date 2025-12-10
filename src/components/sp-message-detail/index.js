/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import React, { PureComponent } from 'react'

import { View, Text, ScrollView } from '@tarojs/components'
import { AtCard } from 'taro-ui'
import './index.scss'

export default class MessageDetail extends PureComponent {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}

  formatSpec(spec) {
    if (spec.length > 0) {
      return spec.join('/')
    } else {
      return '/'
    }
  }

  render() {
    const {
      goodsName,
      total_fee,
      number,
      orderId,
      description,
      afterSalesBn,
      afterSaleType,
      goods_price,
      spec
    } = JSON.parse(this.props.SpMessageDetailData.content)
    const { is_read, operator_id } = this.props.SpMessageDetailData
    const { date, msgType, titleList, OrderHandle, clearUnread } = this.props

    return (
      <View className='cpn-messageDetail'>
        <View className='date'>{date}</View>
        <View className='box'>
          <View
            className='top'
            onClick={(e) => {
              OrderHandle(orderId, msgType, afterSalesBn)
              clearUnread(orderId, afterSalesBn)
            }}
          >
            {msgType === '1' && (
              <>
                <View className='titleBox'>
                  <View>{afterSaleType}</View>
                  {is_read === '0' && <View className='is_read'></View>}
                </View>

                <View className='iconfont icon-jiantou'></View>
              </>
            )}
            {(msgType == '2' || msgType == '3') && (
              <>
                <View className='titleBox'>
                  <View className='title'>{goodsName}</View>
                  {is_read === '0' && <View className='is_read'></View>}
                </View>

                <View className='iconfont icon-jiantou'></View>
              </>
            )}
          </View>
          <View className='list'>
            <View className='item'>
              <View className='title'>{titleList[0]}</View>
              {msgType == '1' && (
                <>
                  <View className='content'>{description}</View>
                </>
              )}
              {(msgType == '2' || msgType == '3') && (
                <>
                  <View className='content'>
                    数量{number}
                    {this.formatSpec(spec)}￥{goods_price}
                  </View>
                </>
              )}
            </View>
            <View className='item'>
              <View className='title'>{titleList[1]}</View>
              <View className='content order'>
                {msgType === '1' && (
                  <>
                    <View className='subtitle'>{goodsName}</View>
                    <View className='info '>
                      （数量：{number} / {goods_price}）
                    </View>
                  </>
                )}
                {(msgType == '2' || msgType == '3') && (
                  <>
                    <View className='info '>{total_fee}</View>
                  </>
                )}
              </View>
            </View>
            <View className='item'>
              <View className='title'>{titleList[2]}</View>
              <View className='content'>{orderId || afterSalesBn}</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
