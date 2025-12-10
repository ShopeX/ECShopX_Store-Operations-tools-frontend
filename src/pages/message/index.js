/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { SpMessage, SpLoading, SpNote, SpToast } from '@/components'
import { showToast } from '@/utils'
import { connect } from 'react-redux'
import api from '@/api'
import './index.scss'

const SpMessageData = [
  {
    type: 1,
    imgurl: require('../../assets/imgs/message/zyk_sh.png'),
    bgColor: {
      background: 'linear-gradient(180deg, #6EA5FF 0%, #93C0FD 100%)'
    },
    title: '售后订单',
    subtitle: '新增售后订单，请及时处理'
  },
  {
    type: 2,
    imgurl: require('../../assets/imgs/message/zyk_dfh.png'),
    bgColor: {
      background: 'linear-gradient(180deg, #FFA040 0%, #FFC758 100%)'
    },
    title: '待发货订单',
    subtitle: '新增发货订单，请及时处理'
  },
  {
    type: 3,
    imgurl: require('../../assets/imgs/message/zyk_wtt.png'),
    bgColor: {
      background: 'linear-gradient(180deg, #FF7C7C 0%, #FF99A4 100%)'
    },
    title: '未妥投订单',
    subtitle: '新增发货订单，请及时处理'
  }
]

@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
export default class Message extends Component {
  constructor() {
    super()
    this.state = {
      messageData: '',
      loading: false
    }
  }
  // 浏览器后退请求
  componentDidMount() {
    this.getConfig()
  }

  componentDidShow() {
    console.log('componentDidShow message page...')
    this.getConfig()
  }
  // 滑动事件
  // onscrollPage(e) {
  //   console.log(e.detail.scrollTop)
  // }

  async getConfig() {
    this.setState({
      loading: true
    })
    let { distributor_id } = this.props.planSelection
    const result = await api.message.getMessageList({ distributor_id })
    this.setState({
      messageData: result,
      loading: false
    })
  }
  onclickHander(item) {
    console.log(item)
    if (this.state.messageData) {
      if (item.type == '1') {
        Taro.navigateTo({
          url: `/pages/messageDetail/index?type=1`
        })
      } else if (item.type == '2') {
        Taro.navigateTo({
          url: `/pages/messageDetail/index?type=2`
        })
      } else if (item.type == '3') {
        Taro.navigateTo({
          url: `/pages/messageDetail/index?type=3`
        })
      }
    } else {
      showToast('暂无数据')
    }
  }

  render() {
    const { date_type_1, date_type_2, date_type_3, num_type_1, num_type_2, num_type_3, is_empty } =
      this.state.messageData
    const { loading } = this.state
    return (
      <View className='page-message'>
        {loading && <SpLoading>正在加载...</SpLoading>}
        {is_empty == 0 && (
          <ScrollView className='message-list'>
            {SpMessageData.map((item, index) => {
              if (index == 0) {
                return (
                  <View key={item.title}>
                    {date_type_1 && (
                      <SpMessage
                        SpMessageData={item}
                        date={date_type_1}
                        messageNum={num_type_1}
                        key={item.title}
                        onclickHander={(e) => this.onclickHander(item)}
                      ></SpMessage>
                    )}
                  </View>
                )
              } else if (index == 1) {
                return (
                  <View key={item.title}>
                    {date_type_2 && (
                      <SpMessage
                        date={date_type_2}
                        messageNum={num_type_2}
                        SpMessageData={item}
                        key={item.title}
                        onclickHander={(e) => this.onclickHander(item)}
                      ></SpMessage>
                    )}
                  </View>
                )
              } else {
                return (
                  <View key={item.title}>
                    {date_type_3 && (
                      <SpMessage
                        date={date_type_3}
                        messageNum={num_type_3}
                        SpMessageData={item}
                        key={item.title}
                        onclickHander={(e) => this.onclickHander(item)}
                      ></SpMessage>
                    )}
                  </View>
                )
              }
            })}
          </ScrollView>
        )}
        {is_empty == 1 && <SpNote img='no_order.png'>暂无消息哦~</SpNote>}
        <SpToast />
      </View>
    )
  }
}
