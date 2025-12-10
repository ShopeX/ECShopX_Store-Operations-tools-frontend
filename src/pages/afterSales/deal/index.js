/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { getThemeStyle, requestCallback, toFixed, isNull, hundred } from '@/utils'
import { SpLoading, SpFormItem, SpInputNumber, SpToast } from '@/components'
import RefuseTextarea from './comps/RefuseTextarea'
import S from '@/spx'
import { OrderRadio, FixedAction, CommonButton } from '@/components/sp-page-components'
import api from '@/api'
import { connect } from 'react-redux'
import './index.scss'
@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
export default class OrderDeal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      status: '',
      isApprove: false,
      refuseReason: '',
      afterSalesInfo: {},
      price: {},
      selectAddress: null,
      fromOrderList: false,
      orderCancelInfo: {}
    }
  }

  async componentDidShow() {
    const {
      router: { params }
    } = getCurrentInstance()

    let afterSalesInfo = {}
    let orderCancelInfo = {}

    if (params?.aftersalesNo) {
      Taro.setStorageSync('aftersalesNo', params?.aftersalesNo)
    }

    if (params?.orderId) {
      Taro.setNavigationBarTitle({ title: '退款审核' })

      //从订单页面而来
      orderCancelInfo = await api.order.getcancelinfo({
        order_id: params?.orderId,
        order_type: 'normal'
      })
      this.setState({
        fromOrderList: true,
        orderCancelInfo
      })
    } else {
      afterSalesInfo = await api.afterSales.detail({
        no: params?.aftersalesNo || Taro.getStorageSync('aftersalesNo')
      })
      await this.getAddressDetail()
    }

    let price = isNull(afterSalesInfo.refund_fee)
      ? toFixed(orderCancelInfo.total_fee)
      : toFixed(afterSalesInfo.refund_fee)
    let point = isNull(afterSalesInfo.refund_point)
      ? orderCancelInfo.point
      : afterSalesInfo.refund_point

    this.setState({
      afterSalesInfo,
      status: afterSalesInfo.aftersales_type,
      price: {
        price,
        point,
        maxPrice: Number(price),
        maxPoint: point,
        priceError: false,
        pointError: false
      }
    })
  }

  dealOrder = () => {
    const {
      router: { params }
    } = getCurrentInstance()
  }

  getAddressDetail = async () => {
    const { router } = getCurrentInstance()

    let { distributor_id } = this.props.planSelection

    const { list: addressList } = await api.afterSales.address({
      page: 1,
      page_size: 100,
      distributor_id: distributor_id
    })

    let selectAddressId = router?.params?.address_id

    if (!selectAddressId) {
      //没有选择地址则取默认地址
      selectAddressId = addressList.find((item) => item.is_default == 1)?.address_id
    }

    if (selectAddressId) {
      const {
        mobile,
        contact,
        regions,
        address,
        address_id: return_address_id
      } = await api.address.detail({ address_id: selectAddressId })

      this.setState({
        selectAddress: {
          mobile,
          contact,
          address: `${regions.replace(/[(\"|\[|\]|\,|')]/g, '')} ${address}`,
          id: return_address_id
        },
        isApprove: !!router?.params?.address_id
      })
    }
  }

  handleChangeApprove = (active) => {
    this.setState({
      isApprove: active === 1
    })
  }

  handleChangeRefuseReason = (reason) => {
    this.setState({
      refuseReason: reason
    })
  }

  handleChangePrice = (price) => {
    this.setState(
      {
        price: {
          ...this.state.price,
          price: Number(price)
        }
      },
      () => {
        if (
          (Number(price) > 0 && this.state.price.maxPrice !== 0) ||
          Number(price) <= this.state.price.maxPrice
        ) {
          this.setState({
            price: {
              ...this.state.price,
              priceError: false
            }
          })
        }
      }
    )
  }

  handleChangePoint = (point) => {
    this.setState(
      {
        price: {
          ...this.state.price,
          point: Number(point)
        }
      },
      () => {
        if (
          (Number(point) > 0 && this.state.price.maxPoint !== 0) ||
          Number(point) <= this.state.price.maxPoint
        ) {
          this.setState({
            price: {
              ...this.state.price,
              pointError: false
            }
          })
        }
      }
    )
  }

  //提交
  handleSubmit = () => {
    const {
      afterSalesInfo,
      isApprove,
      refuseReason,
      price,
      selectAddress,
      fromOrderList,
      orderCancelInfo
    } = this.state

    if (fromOrderList) {
      if (isApprove) {
      } else {
        if (!refuseReason) {
          S.toast('请填写拒绝原因')
          return
        }
      }
      requestCallback(
        async () => {
          let data = await api.order.confirmcancel({
            order_id: orderCancelInfo.order_id,
            check_cancel: isApprove ? 1 : 0,
            shop_reject_reason: refuseReason
          })
          return data
        },
        '审核成功',
        () => {
          setTimeout(() => {
            Taro.redirectTo({ url: `/pages/order/list` })
          }, 500)
        }
      )
      return
    }

    let isValid = this.handleValidInput()

    let params = {
      aftersales_bn: afterSalesInfo.aftersales_bn
    }

    if (isValid && isValid.status) {
      if (isValid.status === 'ONLY_REFUND') {
        params = {
          ...params,
          is_approved: isApprove ? 1 : 0,
          refuse_reason: isApprove ? undefined : refuseReason,
          refund_fee: hundred(price.price),
          refund_point: price.point
        }
      } else if (isValid.status === 'REFUND_GOODS0') {
        params = {
          ...params,
          is_approved: isApprove ? 1 : 0,
          refuse_reason: isApprove ? undefined : refuseReason,
          aftersales_address_id: selectAddress.id
        }
      } else if (isValid.status === 'REFUND_GOODS2') {
        params = {
          ...params,
          check_refund: isApprove ? 1 : 0,
          refund_memo: isApprove ? undefined : refuseReason,
          refund_fee: hundred(price.price),
          refund_point: price.point
        }
      }
    }

    if (isValid) {
      requestCallback(
        async () => {
          let data
          if (isValid.status === 'ONLY_REFUND' || isValid.status === 'REFUND_GOODS0') {
            data = await api.afterSales.review(params)
          } else {
            data = await api.afterSales.confirm(params)
          }
          return data
        },
        '审核成功',
        () => {
          setTimeout(() => {
            Taro.redirectTo({ url: `/pages/afterSales/list` })
          }, 500)
        }
      )
    }
  }

  //验证输入
  handleValidInput = () => {
    const { status, isApprove, refuseReason, price, afterSalesInfo } = this.state

    if (status === 'ONLY_REFUND' || (status === 'REFUND_GOODS' && afterSalesInfo.progress === 2)) {
      //如果是同意
      if (isApprove) {
        if (price.price === 0 && price.maxPrice !== 0) {
          this.setState({
            price: {
              ...price,
              priceError: '退款金额不能为空'
            }
          })
          return
        } else if (price.point === 0 && price.maxPoint !== 0) {
          this.setState({
            price: {
              ...price,
              pointError: '退款积分不能为空'
            }
          })
          return
        } else if (price.point > price.maxPoint) {
          this.setState({
            price: {
              ...price,
              pointError: '退款积分不能大于最大退款积分'
            }
          })
          return
        } else if (price.price > price.maxPrice) {
          this.setState({
            price: {
              ...price,
              priceError: '退款金额不能大于最大退款金额'
            }
          })
          return
        }
      } else {
        if (!refuseReason) {
          S.toast('请填写拒绝原因')
          return
        }
      }
    }

    if (status === 'REFUND_GOODS' && afterSalesInfo.progress === 0) {
      //如果是同意
      if (isApprove) {
      } else {
        if (!refuseReason) {
          S.toast('请填写拒绝原因')
          return
        }
      }
    }

    return {
      status: status === 'ONLY_REFUND' ? 'ONLY_REFUND' : `${status}${afterSalesInfo.progress}`
    }
  }

  handleNavigateAdressList = () => {
    Taro.navigateTo({ url: '/pages/address/index' })
  }

  handleClickAdress = () => {
    this.handleNavigateAdressList()
  }

  handleClickTip = () => {
    this.handleNavigateAdressList()
  }

  render() {
    const { status, loading, isApprove, afterSalesInfo, price, selectAddress, fromOrderList } =
      this.state

    return loading ? (
      <SpLoading>正在加载...</SpLoading>
    ) : (
      <View className='page-order-deal' style={getThemeStyle()}>
        <SpFormItem labelbold label='处理结果' className='box-shadow-common'>
          <OrderRadio
            leftTitle='拒绝'
            rightTitle='同意'
            active={isApprove ? 1 : 0}
            onChange={this.handleChangeApprove}
          />
        </SpFormItem>

        {(status === 'ONLY_REFUND' ||
          (status === 'REFUND_GOODS' && afterSalesInfo.progress === 2) ||
          fromOrderList) && (
          <View className='marginTop24 box-shadow-common'>
            {isApprove && (
              <SpFormItem labelbold label='处理方案' className='formItemPrice' wrap>
                <View className='page-order-deal-comps-writepricearea'>
                  <View className='form-price'>
                    <View className='labelc'>退款金额（元）</View>
                    <View className='value'>
                      <SpInputNumber
                        placeholder='请填写金额'
                        clear
                        disabled={fromOrderList}
                        error={price.priceError}
                        value={price.price}
                        onChange={this.handleChangePrice}
                      />
                    </View>
                  </View>
                  <View className='form-price marginTop20'>
                    <View className='labelc'>退款积分（分）</View>
                    <View className='value'>
                      <SpInputNumber
                        placeholder='请填写积分'
                        clear
                        disabled={fromOrderList}
                        error={price.pointError}
                        value={price.point}
                        onChange={this.handleChangePoint}
                      />
                    </View>
                  </View>
                </View>
              </SpFormItem>
            )}
          </View>
        )}

        {status === 'REFUND_GOODS' && afterSalesInfo.progress === 0 && (
          <View className='marginTop24 box-shadow-common'>
            {isApprove && (
              <SpFormItem
                label='回寄地址'
                labelbold
                placeholder='请选择售后地址'
                wrap={selectAddress}
                tip='修改售后地址'
                onClickValue={this.handleClickAdress}
                onClickTip={this.handleClickTip}
              >
                {selectAddress && (
                  <View className='address'>
                    <View className='item'>
                      <View className='label'>联系人</View>
                      <View className='value'>{selectAddress.contact}</View>
                    </View>
                    <View className='item'>
                      <View className='label'>电话号码</View>
                      <View className='value'>{selectAddress.mobile}</View>
                    </View>
                    <View className='item'>
                      <View className='label'>回寄地址</View>
                      <View className='value'>{selectAddress.address}</View>
                    </View>
                  </View>
                )}
              </SpFormItem>
            )}
          </View>
        )}

        {!isApprove && (
          <SpFormItem
            label='拒绝原因'
            labelbold
            className='formItemRefuse marginTop24 box-shadow-common'
            wrap
          >
            <RefuseTextarea onChange={this.handleChangeRefuseReason} />
          </SpFormItem>
        )}

        <SpToast />

        <FixedAction>
          <CommonButton text='提交审核' type='primary' size='normal' onClick={this.handleSubmit} />
        </FixedAction>
      </View>
    )
  }
}
