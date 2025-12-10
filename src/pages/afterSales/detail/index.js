/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import WxImageViewer from 'react-wx-images-viewer'
import { getThemeStyle, timestampToTime, classNames } from '@/utils'
import { SpGoodItem, SpGoodPrice, SpToast, SpLoading, SpRemarkItem } from '@/components'
import { DetailCard, FixedAction, PageActionButtons } from '@/components/sp-page-components'
import { View, Text, Image } from '@tarojs/components'
import { afterSales } from '@/consts'
import api from '@/api'
import './index.scss'

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //订单详情
      orderInfo: {},
      pageType: 'afterSalesDetail',
      detail: {},
      loading: false,
      emptyTip: '无',
      viewImage: {
        index: 0,
        open: false
      }
    }
  }

  async componentDidShow() {
    this.getDetail()
  }

  //获取详情
  getDetail = async () => {
    const {
      router: {
        params: { aftersalesNo }
      }
    } = getCurrentInstance()
    this.setState({
      loading: true
    })
    const detail = await api.afterSales.detail({ no: aftersalesNo })
    this.setState({
      detail
    })
    this.setState({
      loading: false
    })
  }

  handleRefresh = () => {
    this.getDetail()
  }

  /** 打开预览图片 */
  handleOpenView = (index) => {
    console.log('handleOpenView', index)
    this.setState({
      viewImage: {
        index,
        open: true
      }
    })
  }

  handleCloseView = () => {
    this.setState({
      viewImage: {
        index: 0,
        open: false
      }
    })
  }

  render() {
    const { emptyTip, pageType, loading, detail, viewImage } = this.state

    return loading ? (
      <SpLoading>正在加载...</SpLoading>
    ) : (
      <View className='page-aftersales-detail' style={getThemeStyle()}>
        <DetailCard pageType={pageType} detail={detail} />

        <View className='card-center'>
          <View className='title'>申请信息</View>
          <View className='item'>
            <View className='label'>退货理由</View>
            <View className='value'>{detail?.reason || emptyTip}</View>
          </View>
          <View className='item'>
            <View className='label'>退货描述</View>
            <View className='value'>{detail?.description || emptyTip}</View>
          </View>
          <View className='item'>
            <View className='label'>图片信息</View>
            {detail?.evidence_pic?.length ? (
              <View className={classNames('value', { ['picwrapper']: true })}>
                {detail?.evidence_pic?.map((pic, index) => (
                  <View className='pic' onClick={this.handleOpenView.bind(this, index)}>
                    <Image src={pic} className='image' />
                  </View>
                ))}
              </View>
            ) : (
              <View className='value'>{emptyTip}</View>
            )}
          </View>
        </View>

        <SpRemarkItem
          pageType={pageType}
          orderInfo={detail}
          onRefresh={this.handleRefresh}
          className='remark-component'
        />

        <View className='good-detail'>
          <View className='good-detail-content'>
            {detail?.detail?.map((goodItem, index) => (
              <SpGoodItem
                goodInfo={goodItem}
                orderInfo={detail?.order_info}
                className='goodItem'
                pageType={pageType}
                key={index}
              />
            ))}
          </View>
        </View>

        <View className='card-bottom'>
          <View className='item'>售后单号：{detail?.aftersales_bn}</View>
          <View className='item'>订单号：{detail?.order_id}</View>
          <View className='item'>
            售后类型：{afterSales.AFTERSALES_TYPE[detail?.aftersales_type]}
          </View>
          <View className='item'>申请时间：{timestampToTime(detail?.create_time)}</View>
          <View className='item'>
            <Text>应退总金额：</Text>
            <SpGoodPrice className='refundFee' price={detail?.refund_fee} isSame size={24} />
          </View>
          <View className='item'>
            <Text>应退总积分：</Text>
            <SpGoodPrice className='refundFee' point={detail?.refund_point} isSame size={24} />
          </View>
        </View>

        <SpToast />

        <FixedAction pageType={pageType}>
          <PageActionButtons
            buttons={detail?.app_info?.buttons}
            pageType={pageType}
            orderInfo={{ ...detail?.order_info, aftersales_bn: detail?.aftersales_bn }}
            maxOrderInfo={detail}
          />
        </FixedAction>

        {viewImage.open && (
          <WxImageViewer
            onClose={this.handleCloseView}
            urls={detail?.evidence_pic || []}
            index={viewImage.index}
          />
        )}
      </View>
    )
  }
}

export default OrderDetail
