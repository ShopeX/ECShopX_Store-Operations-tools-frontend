/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { PureComponent } from 'react'
import api from '@/api'
import { ScrollView, View, Text } from '@tarojs/components'
import { SpMessageDetail, SpLoading, SpTips, SpToast } from '@/components'
import { timestampToTime } from '@/utils'
import { connect } from 'react-redux'
import { withPager } from '@/hocs'
import './index.scss'

@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
@withPager
export default class MessageDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      detailList: [],
      titleList: [],
      page: 1,
      loading: false
    }
  }
  componentDidMount() {
    this.routerConfig()
  }
  async componentDidShow() {
    await this.init()
  }

  init() {
    this.resetPage(() => {
      this.setState(
        {
          ...this.state,
          detailList: []
        },
        () => {
          console.log(this.state)
          this.nextPage()
        }
      )
    })
  }
  routerConfig() {
    const { type } = getCurrentInstance().router.params
    console.log(type)
    if (type == '1') {
      this.setState({
        titleList: ['处理进度', '商品名称', '售后单号']
      })
    } else {
      this.setState({
        titleList: ['商品详情', '实付金额', '订单编号']
      })
    }
  }
  async getConfig(params) {
    const { type } = getCurrentInstance().router.params
    let { distributor_id } = this.props.planSelection

    const obj = {
      msg_type: type, //  1: 售后, 2: 待发货, 3: 未妥投
      distributor_id,
      id: 0
    }
    const { list, total_count } = await api.message.getMessageDetail({
      ...obj,
      page: params.page_no,
      pageSize: params.page_size
    })

    this.setState({
      detailList: [...this.state.detailList, ...list]
    })
    return {
      total_count
    }
  }

  fetch = async (params) => {
    this.setState({
      loading: true
    })
    const { total_count } = await this.getConfig(params)
    this.setState({
      loading: false
    })
    return {
      total: total_count
    }
  }

  OrderHandle(order_id, msg_type, afterSalesBn) {
    if (msg_type == 1) {
      Taro.navigateTo({
        url: `/pages/afterSales/detail?aftersalesNo=${afterSalesBn}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/order/detail?order_id=${order_id}`
      })
    }
  }
  clearUnread = async (order_id, after_sales_bn) => {
    const { type } = getCurrentInstance().router.params
    const obj = {
      distributor_id: this.props.planSelection.distributor_id,
      msg_type: type,
      is_all_read: true,
      order_id,
      after_sales_bn
    }
    if (order_id || after_sales_bn) {
      obj.is_all_read = false
    }
    await api.message.clearUnread(obj)
    if (obj.is_all_read) this.init()
  }

  render() {
    const { loading, page } = this.state
    return (
      <ScrollView
        className='page-messageDetail'
        scrollY
        scrollWithAnimation
        onScrollToLower={this.nextPage}
      >
        <View className='tips'>
          <View className='tip'>
            <Text className='iconfont icon-shaixuan1'></Text>
            <Text>消息时间由近及远</Text>
          </View>
          <View className='clearRead'>
            <Text className='iconfont icon-qingchu'></Text>
            <Text onClick={() => this.clearUnread()}>清除未读</Text>
          </View>
        </View>
        {this.state.detailList &&
          this.state.detailList.map((item) => {
            return (
              <SpMessageDetail
                date={timestampToTime(item.add_time)}
                key={item.id}
                SpMessageDetailData={item}
                msgType={item.msg_type}
                titleList={this.state.titleList}
                OrderHandle={this.OrderHandle}
                clearUnread={this.clearUnread}
              />
            )
          })}
        {loading && <SpLoading>正在加载...</SpLoading>}
        {!page.hasNext && <SpTips msg={'没有更多了哦~'}></SpTips>}
        <SpToast />
      </ScrollView>
    )
  }
}
