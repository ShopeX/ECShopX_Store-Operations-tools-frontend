/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { getThemeStyle, timestampToTime, calcTimer } from '@/utils'
import { SpGoodItem, SpGoodPrice, SpToast, SpLoading, SpRemarkItem } from '@/components'
import {
  DetailCard,
  MessageCard,
  FixedAction,
  PageActionButtons
} from '@/components/sp-page-components'
import { View, Text } from '@tarojs/components'
import { AtCountdown, AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { ALLSELFDELIVERYSTATUSLIST } from '@/consts'
import api from '@/api'
import './index.scss'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //订单详情
      orderInfo: {},
      pageType: 'orderDetail',
      timer: {
        mm: 0,
        ss: 0
      },
      tradeInfo: {},
      userInfo: {},
      leftContent: [],
      rightContent: [],
      logisticsList: [],
      leftPhone: '',
      rightPhone: '',
      loading: false,
      squareRoot: false, //待开方
      supplement: false, //待补充
      isOpened: false //支付弹窗
    }
  }

  async componentDidShow() {
    await this.getDetail(true)
    await this.getUserinfo()
    this.calcTimer()
    await this.renderLeftContent()
    await this.renderRightContent()
    this.setState({
      loading: false
    })
    this.getLogistics()
  }

  getUserinfo = async () => {
    const {
      orderInfo: { user_id }
    } = this.state
    const userInfo = await api.order.member({ userId: user_id })
    this.setState({
      userInfo
    })
  }

  getDetail = async (init) => {
    const {
      router: {
        params: { order_id }
      }
    } = getCurrentInstance()
    this.setState({
      loading: true
    })
    const { orderInfo, tradeInfo } = await api.order.detail({ orderId: order_id })
    if (orderInfo.invoice) {
      orderInfo.app_info?.buttons.unshift({ type: 'invoice', name: '开发票' })
    }

    this.setState({
      orderInfo,
      tradeInfo,
      squareRoot:
        orderInfo.order_status == 'NOTPAY' &&
        orderInfo.prescription_status == 1 &&
        Array.isArray(orderInfo?.diagnosis_data),
      supplement:
        orderInfo.order_status == 'NOTPAY' &&
        orderInfo.prescription_status == 1 &&
        orderInfo?.diagnosis_data?.id
    })
    if (!init) {
      this.setState({
        loading: false
      })
    }
  }

  //得出发货时间
  getLogistics = async () => {
    const { orderInfo } = this.state
    const list = await api.logistics.getDeliveryList({ order_id: orderInfo.order_id })
    this.setState({
      logisticsList: list
    })
  }

  //计算倒计时
  calcTimer = async () => {
    const {
      orderInfo: { auto_cancel_seconds }
    } = this.state
    this.setState({
      timer: calcTimer(auto_cancel_seconds)
    })
  }

  //渲染左内容
  renderLeftContent = () => {
    const {
      orderInfo: {
        receipt_type,
        receiver_name,
        receiver_mobile,
        receiver_state,
        receiver_city,
        receiver_district,
        receiver_address,
        mobile
      },
      userInfo
    } = this.state
    let leftContent
    if (receipt_type === 'ziti') {
      leftContent = [
        {
          label: '提货人',
          value: `${userInfo.username || ''}`
        },
        {
          label: '手机号',
          value: mobile
        }
      ]
    } else {
      leftContent = [
        {
          label: '收货人',
          value: `${receiver_name} ${receiver_mobile}`
        },
        {
          label: '收货地址',
          value: `${receiver_state} ${receiver_city} ${receiver_district} ${receiver_address}`
        }
      ]
    }
    this.setState({
      leftContent,
      leftPhone: receiver_mobile
    })
  }

  //渲染右内容
  renderRightContent = async () => {
    const { userInfo } = this.state
    let rightContent
    rightContent = [
      {
        label: '买家信息',
        value: `${userInfo.username || ''} ${userInfo.mobile || ''}`
      }
    ]
    this.setState({
      userInfo,
      rightContent,
      rightPhone: userInfo.mobile
    })
  }

  //渲染主状态
  renderMainStatus = () => {
    const { orderInfo } = this.state
    let main_status = orderInfo?.app_info?.detail_status?.main_msg
    return main_status
  }

  //渲染描述
  renderDesc = () => {
    const { orderInfo, timer } = this.state
    let type = orderInfo?.app_info?.detail_status?.type
    let description = orderInfo?.app_info?.detail_status?.description
    //如果类型是文本直接返回文案
    if (type === 'text') {
      return description
    } else if (type === 'cancel') {
      return <View>商家取消订单，查看退款状态</View>
    } else if (type === 'not_pay') {
      return (
        <View className='notpay_desc'>
          <View>买家尚未支付，剩余</View>
          <AtCountdown
            className='countdown__time'
            format={{ hours: '小时', minutes: '分钟', seconds: '秒' }}
            hours={timer.hh}
            minutes={timer.mm}
            seconds={timer.ss}
          />
        </View>
      )
    } else if (type === 'dada_cancel') {
      return (
        <View className='dada_cancel_desc'>
          <View>骑士取消订单，请</View>
          <View>重新呼叫</View>
        </View>
      )
    }
  }

  //渲染物流标题
  renderLogiticsTitle = (desc, title) => {
    const {
      orderInfo: { receipt_type }
    } = this.state
    console.log(this.state)
    if (receipt_type === 'dada') {
      if (desc) {
        return '同城配送'
      }
      if (title) {
        return '同城配订单'
      }
      return '同城配信息'
    } else if (receipt_type === 'ziti') {
      if (desc) {
        return '自提'
      }
      if (title) {
        return '自提订单'
      }
      return '自提信息'
    } else if (receipt_type == 'merchant') {
      if (desc) {
        return '商家自配送'
      }
      if (title) {
        return '商家自配'
      }
      return '商家自配送'
    } else {
      if (desc) {
        return '普通快递'
      }
      if (title) {
        return '普通订单'
      }
      return '物流信息'
    }
  }

  //渲染物流描述
  renderLogiticsDesc = () => {
    const { orderInfo } = this.state

    let deliveryLogs = orderInfo?.app_info?.delivery_log || []

    let deliveryLog = deliveryLogs[deliveryLogs.length - 1] || {}

    return `${deliveryLog.msg} ${timestampToTime(deliveryLog.time)}`
  }

  //判断是收件人还是取件人
  renderCardLeftTitle = () => {
    const {
      orderInfo: { receipt_type }
    } = this.state
    if (receipt_type === 'ziti') {
      return '取件人信息'
    } else {
      return '收货人信息'
    }
  }

  //渲染价格
  renderTotalFee = () => {
    const {
      orderInfo: { point, item_fee }
    } = this.state
    //金额订单
    if (point == 0) {
      return <SpGoodPrice size={24} price={item_fee} isSame />
      //积分订单
    } else if (item_fee == 0) {
      return <SpGoodPrice size={24} point={point} isSame />
    } else {
      return <SpGoodPrice size={24} price={item_fee} point={point} isSame />
    }
  }

  //渲染优惠金额
  renderDiscountFee = () => {
    const {
      orderInfo: { discount_fee }
    } = this.state
    return <SpGoodPrice size={24} prefix='-' price={discount_fee} isSame />
  }

  //渲染运费
  renderFreightFee = () => {
    const {
      orderInfo: { freight_fee }
    } = this.state
    return <SpGoodPrice size={24} prefix='+' price={freight_fee} isSame />
  }

  // 积分抵扣运费
  renderPointFreightFee = () => {
    const {
      orderInfo: { point_freight_fee }
    } = this.state
    return <SpGoodPrice size={24} prefix='-' price={point_freight_fee} isSame />
  }

  //渲染实价
  renderRealFee = () => {
    const {
      orderInfo: { total_fee }
    } = this.state
    return <SpGoodPrice size={24} price={total_fee} isSame color='red' />
  }

  //查看物流详情
  viewDeliveryDetail = () => {
    const {
      orderInfo: { order_id, order_status }
    } = this.state

    Taro.navigateTo({
      url: `/pages/logisticsInfo/index?order_id=${order_id}&order_status=${order_status}`
    })
  }

  //刷新
  handleRefresh = () => {
    this.getDetail()
  }

  handleClickButton = (type) => {
    const {
      orderInfo: { order_id }
    } = this.state
    if (type == 'markdown') {
      // 临时做法：后期websocket方案优化
      this.times = 0
      this.timer = setInterval(async () => {
        this.times++
        const { orderInfo: _orderInfo, tradeInfo: _tradeInfo } = await api.order.detail({
          orderId: order_id
        })
        console.log('this.state.orderInfo.total_fee:', this.state.orderInfo)
        if (_orderInfo.total_fee != this.state.orderInfo.total_fee) {
          this.setState({
            orderInfo: _orderInfo,
            tradeInfo: _tradeInfo
          })
          clearInterval(this.timer)
        } else {
          if (this.times >= 40) {
            clearInterval(this.timer)
          }
        }
      }, 3000)
      wx.miniProgram.navigateTo({
        url: `/subpages/dianwu/trade/change-price?trade_id=${order_id}`
      })
      return
    } else if (type == 'cancel') {
      wx.miniProgram.navigateTo({
        url: `/subpages/dianwu/trade/cancel-trade?trade_id=${order_id}`
      })
    } else if (type == 'aftersales') {
      wx.miniProgram.navigateTo({
        url: `/subpages/dianwu/trade/sale-after?trade_id=${order_id}`
      })
    } else if (type == 'invoice') {
      wx.miniProgram.navigateTo({
        url: `/subpages/dianwu/trade/invoice?trade_id=${order_id}`
      })
    } else if (type == 'payment') {
      this.setState({
        isOpened: true
      })
    }
  }

  //微信/支付宝收款
  handleClickScanCode = async () => {
    console.log('kkkllllhhhh')
    //h5调取不了摄像头，直接跳转到小程序，小程序实现此功能
    const { orderInfo } = this.state
    wx.miniProgram.redirectTo({
      url: `/subpages/dianwu/payment?order_id=${orderInfo.order_id}`
    })
    // const {orderInfo} = this.state
    // const { errMsg, result } = await Taro.scanCode()
    // if (errMsg == 'scanCode:ok') {
    //   console.log(`handleClickScanCode:`, result)
    //   const { trade_info } = await api.order.orderPayment({
    //     order_id:orderInfo.order_id,
    //     auth_code: result
    //   })
    //   // dispatch(selectMember(null))
    //   // onEventCreateOrder()
    //   wx.miniProgram.redirectTo({
    //     url: `/subpages/dianwu/collection-result?order_id=${orderInfo.order_id}&trade_id=${trade_info.trade_id}`
    //   })
    // } else {
    //   // showToast(errMsg)
    // }
  }

  //现金收款
  handleClickCash = async () => {
    const { orderInfo } = this.state
    const res = await Taro.showModal({
      title: '现金收款确认提示',
      content: '请确认是否已收到商品款?',
      showCancel: true,
      cancel: '取消',
      cancelText: '未收到',
      confirmText: '确认收到'
    })
    if (!res.confirm) return
    const order_id = orderInfo.order_id
    await api.order.orderPayment({
      order_id,
      pay_type: 'pos'
    })
    wx.miniProgram.redirectTo({
      url: `/subpages/dianwu/collection-result?order_id=${order_id}&pay_type=pos`
    })
  }

  getSelfDeliveryStatus = (value) => {
    return ALLSELFDELIVERYSTATUSLIST.find((item) => item.value == value)?.label ?? '-'
  }

  render() {
    const {
      orderInfo,
      tradeInfo,
      pageType,
      leftContent,
      rightContent,
      leftPhone,
      rightPhone,
      logisticsList,
      loading,
      squareRoot,
      supplement,
      isOpened
    } = this.state

    let terminal_info = orderInfo?.app_info?.terminal_info
    return loading ? (
      <SpLoading>正在加载...</SpLoading>
    ) : (
      <View className='page-order-detail' style={getThemeStyle()}>
        <View className='wrapper'>
          <DetailCard
            pageType='orderDetail'
            status={this.renderMainStatus()}
            subStatus={this.renderDesc()}
            iconClassName={orderInfo?.app_info?.detail_status?.icon}
          />

          <View className='card-center'>
            <View>
              <View className='title'>{this.renderLogiticsTitle()}</View>
              <View className='desc'>{this.renderLogiticsDesc()}</View>
            </View>
            <View className='right' onClick={this.viewDeliveryDetail}>
              <Text className='iconfont icon-chakan'></Text>
              <Text>查看详情</Text>
            </View>
          </View>

          {orderInfo?.prescription_status > 0 && (
            <View className='information'>
              <View className='title'>
                <Text className='title-num'>1</Text>
                <Text className='title-text'>填写信息</Text>
              </View>
              <View className='titled'>-----</View>
              <View className='titled'>
                <Text
                  className={
                    squareRoot || orderInfo.prescription_status == 2 ? 'title-num' : 'titled-num'
                  }
                >
                  2
                </Text>
                <Text
                  className={squareRoot || orderInfo.prescription_status == 2 ? 'title-text' : ''}
                >
                  医生开方
                </Text>
              </View>
              <View className='titled'>-----</View>
              <View className='titled'>
                <Text className={orderInfo.prescription_status == 2 ? 'title-num' : 'titled-num'}>
                  3
                </Text>
                <Text className={orderInfo.prescription_status == 2 ? 'title-text' : ''}>
                  支付订单
                </Text>
              </View>
            </View>
          )}

          <MessageCard
            className='message-card'
            leftTitle={this.renderCardLeftTitle()}
            leftContent={leftContent}
            rightContent={rightContent}
            leftPhone={leftPhone}
            rightPhone={rightPhone}
            user_delete={orderInfo?.user_delete} // 是否为注销用户
          />
          {/* 客户留言 */}
          {orderInfo?.remark && (
            <SpRemarkItem pageType={pageType} label='客户留言' orderInfo={orderInfo} />
          )}
          {/* 商家备注 */}
          <SpRemarkItem pageType={pageType} orderInfo={orderInfo} onRefresh={this.handleRefresh} />

          <View className='order-detail'>
            <View className='order-detail-title'>
              {/* <View className='text'>{this.renderLogiticsTitle(false, true)}</View> */}
              <View className='text'>{orderInfo?.app_info?.order_class_name}</View>

              <View className='status'></View>
            </View>

            <View className='order-detail-content'>
              {orderInfo?.items?.map((goodItem, index) => (
                <SpGoodItem
                  // onClick={onGoodItemClick}
                  goodInfo={goodItem}
                  orderInfo={orderInfo}
                  className='goodItem'
                  pageType='orderDetail'
                  key={index}
                />
              ))}
            </View>

            <View className='order-detail-footer'>
              <View className='item'>
                <View className='field'>配送方式</View>
                <View className='value'>{this.renderLogiticsTitle(true)}</View>
              </View>
              <View className='item'>
                <View className='field'>商品总价</View>
                <View className='value'>{this.renderTotalFee()}</View>
              </View>
              <View className='item'>
                <View className='field'>优惠金额</View>
                <View className='value'>{this.renderDiscountFee()}</View>
              </View>
              <View className='item'>
                <View className='field'>运费</View>
                <View className='value'>{this.renderFreightFee()}</View>
              </View>
              <View className='item'>
                <View className='field'>积分抵扣运费</View>
                <View className='value'>{this.renderPointFreightFee()}</View>
              </View>
              <View className='item'>
                <View className='field'>实收金额</View>
                <View className='value'>{this.renderRealFee()}</View>
              </View>
            </View>
          </View>

          <View className='card-bottom'>
            <View className='item'>下单时间：{timestampToTime(orderInfo.create_time)}</View>
            {tradeInfo.timeExpire && (
              <View className='item'>交易时间：{timestampToTime(tradeInfo.timeExpire)}</View>
            )}
            {!!logisticsList?.length && (
              <View className='item'>
                发货时间：{logisticsList[logisticsList?.length - 1].delivery_time}
              </View>
            )}
            {terminal_info && (
              <View className='item'>
                {terminal_info?.msg}：{timestampToTime(terminal_info?.time)}
              </View>
            )}
            <View className='item'>订单编号：{orderInfo.order_id}</View>
            <View className='item'>交易单号：{tradeInfo.tradeId}</View>
            {!!tradeInfo.transactionId && (
              <View className='item'>交易流水号：{tradeInfo.transactionId}</View>
            )}
          </View>

          {/* {orderInfo?.prescription_status > 0 && !supplement && ( */}
          {/* {(orderInfo?.diagnosis_data?.location_url || orderInfo?.diagnosis_data?.doctor_name) && (
            <View className='delivery-information'>
              <View className='delivery-information-title'>处方信息</View>
              <View className='delivery-information-details'>
                <View>
                  {orderInfo?.diagnosis_data?.doctor_name && (
                    <View className='delivery-information-details-item'>
                      <View className='field'>开方医生</View>
                      <View>{orderInfo?.diagnosis_data?.doctor_name}</View>
                    </View>
                  )}
                  {orderInfo?.diagnosis_data?.location_url && (
                    <View className='delivery-information-details-item'>
                      <View className='field'>开方记录</View>
                      <View
                        onClick={() => {
                          const webviewSrc = encodeURIComponent(
                            orderInfo?.diagnosis_data?.location_url
                          )
                          wx.miniProgram.redirectTo({
                            url: `/pages/webview?url=${webviewSrc}`
                          })
                        }}
                      >
                        查看 {'>'}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )} */}

          {orderInfo?.receipt_type == 'merchant' && (
            <View className='delivery-information'>
              <View className='delivery-information-title'>配送信息</View>
              <View className='delivery-information-details'>
                <View>
                  <View className='delivery-information-details-item'>
                    <View className='field'>快递公司</View>
                    <View>{orderInfo?.delivery_corp_name}</View>
                  </View>
                  <View className='delivery-information-details-item'>
                    <View className='field'>配送员</View>
                    <View>
                      {orderInfo?.self_delivery_operator_name
                        ? `${orderInfo?.self_delivery_operator_name} ：${orderInfo?.self_delivery_operator_mobile}`
                        : '-'}
                    </View>
                  </View>
                  <View className='delivery-information-details-item'>
                    <View className='field'>配送状态</View>
                    <View>{this.getSelfDeliveryStatus(orderInfo?.self_delivery_status)}</View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 支付弹框 */}
        <AtModal
          className='collection-modal'
          isOpened={isOpened}
          onClose={() => {
            this.setState({
              isOpened: false
            })
          }}
        >
          <AtModalHeader>应收款</AtModalHeader>
          <AtModalContent>
            <View className='total-mount'>¥{orderInfo.total_fee / 100}</View>
            <View className='payment' onClick={this.handleClickScanCode.bind()}>
              <View className='payments'>
                <Text className='iconfont icon-saoma'></Text>
                <Text>微信/支付宝收款</Text>
              </View>
              <View className='iconfont icon-arrowRight'></View>
            </View>
            <View className='payment' onClick={this.handleClickCash.bind()}>
              <View className='payments'>
                <Text className='iconfont icon-money'></Text>
                <Text>现金收款</Text>
              </View>
              <View className='iconfont icon-arrowRight'></View>
            </View>
          </AtModalContent>
        </AtModal>

        <SpToast />

        <FixedAction pageType={pageType}>
          <PageActionButtons
            buttons={orderInfo.app_info?.buttons}
            pageType={pageType}
            orderInfo={orderInfo}
            onClick={this.handleClickButton.bind(this)}
          />
        </FixedAction>
      </View>
    )
  }
}

export default OrderDetail
