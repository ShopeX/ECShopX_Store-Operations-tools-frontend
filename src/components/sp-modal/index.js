/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import React, { PureComponent } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import { SpRadio } from '@/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import './index.scss'

const flag = {
  success: {
    img: require('@/assets/imgs/index/success.png'),
    text: '兑换券订单核销成功，请尽快交付！'
  },
  fail: {
    img: require('@/assets/imgs/index/fail.png'),
    text: '兑换券订单核销失败',
    tips: '请通知客户去活动范围内的店铺进行兑换！'
  }
}
export default class MessageDetail extends PureComponent {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}

  render() {
    console.log(this.props)
    const { status, visible, shopList, order_info } = this.props.currentModal
    const { handleCancel, orderInfoHandle } = this.props
    return (
      <View className='cpn-modal'>
        {visible && (
          <AtModal isOpened={visible}>
            <AtModalHeader className={'header' + (status == 'fail' ? ' fail_header' : '')}>
              <View className='imgBox'>
                <Image className='img' src={flag[status].img}></Image>
              </View>
              <View className='text'>
                {flag[status].text}
                {status == 'fail' && <View className='tips'>{flag[status].tips || 1222}</View>}
              </View>
            </AtModalHeader>
            <AtModalContent className='content_'>
              <View className={'list' + (status == 'fail' ? ' fail' : '')}>
                <View className='nav'>
                  <Image className='img' src={require('@/assets/imgs/index/book.png')}></Image>
                  <View className='detail'>
                    {status == 'success' ? (
                      <View className='successBox'>
                        <View className='imgBox'>
                          <Image className='img' src={order_info[0].pic}></Image>
                        </View>
                        <View className='title'>{order_info[0].item_name}</View>
                        <View className='type'>规格：{order_info[0].item_spec_desc}</View>
                        <View className='num type'>数量：{order_info[0].num}</View>
                      </View>
                    ) : (
                      <View className='failBox'>
                        <View className='title'>推荐可选门店：</View>
                        <ScrollView className='box'>
                          <SpRadio SpRadioData={shopList} activeHandle={() => {}}></SpRadio>
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </AtModalContent>
            <AtModalAction className='bottom'>
              <Button onclick={() => handleCancel()}>关闭</Button>
              {status == 'success' && (
                <Button className='btn' onClick={() => orderInfoHandle(order_info[0].order_id)}>
                  查看详情
                </Button>
              )}
            </AtModalAction>
          </AtModal>
        )}
      </View>
    )
  }
}
