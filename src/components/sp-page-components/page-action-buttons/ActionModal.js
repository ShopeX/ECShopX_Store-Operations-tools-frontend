/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import React, { PureComponent } from 'react'
import { Text, View, Input } from '@tarojs/components'
import { classNames, requestCallback, qwsdk, isIos } from '@/utils'
import { AtModal, AtInput } from 'taro-ui'
import api from '@/api'
import './index.scss'

export default class ActionModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      veriCode: ['', '', '', '', '', ''],
      veriError: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { href } = window.location
    const { type } = this.props

    if (type === 'verification') {
      console.log('componentDidUpdate', type)
      const sdkAuthUrlIos = Taro.getStorageSync('sdk_auth_url_ios')
      qwsdk.register({
        url: isIos() ? `${sdkAuthUrlIos}` : href
      })
    }
    if (prevProps.visible !== this.props.visible && this.props.visible && type === 'verification') {
      // if (isIos()) {
      //   document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
      // } else {
      setTimeout(() => {
        //document.getElementById('inputwrapper').getElementsByClassName('taro-input')[0].focus()
        console.log(
          "document.getElementById('inputwrapper')",
          document.getElementById('inputwrapper').getElementsByClassName('weui-input')[0].focus()
        )
      }, 300)
      // }
    }
  }

  handleChangeInputVericode = (e) => {
    const { orderInfo, onRefresh } = this.props
    const value = e.detail.value

    if (!value) {
      this.setState({
        veriError: false
      })
    }

    this.setState(
      {
        veriCode: this.fillSix(value)
      },
      () => {
        //如果核销码全填
        if (this.state.veriCode.every((item) => item)) {
          requestCallback(
            async () => {
              console.log('orderInfo', orderInfo)
              const data = await api.order.writeoff({
                orderId: orderInfo.order_id,
                pickupcode: this.state.veriCode.reduce((total, current) => {
                  return total + current
                }, '')
              })
              return data
            },
            '核销订单成功',
            () => {
              this.handleClose()
              onRefresh?.()
            },
            () => {
              this.setState({
                veriError: '核销码不存在或有误，请检查！'
              })
            }
          )
        }
      }
    )
  }

  fillSix = (value = '') => {
    let newArray = value.split('')
    let max = 6
    if (newArray.length < max) {
      new Array(max - newArray.length).fill('').forEach((item) => {
        newArray.push('')
      })
    }
    return newArray
  }

  computedRealLength = () => {
    return this.state.veriCode.join('').trim().length
  }

  renderContent = () => {
    let childrenNode = null

    const { type, orderInfo } = this.props

    const { veriError } = this.state

    if (type === 'phone') {
      childrenNode = (
        <View className='phoneContent'>
          <View className='item item1'>拨打电话</View>
          <View className='item item2'>{orderInfo.mobile}</View>
        </View>
      )
    } else if (type === 'cancelOrder') {
      childrenNode = (
        <View className='cancelContent'>
          <View className='item item1'>取消订单</View>
          <View className='item item2'>确认取消该客户的订单吗？</View>
        </View>
      )
    } else if (type === 'deleteGood') {
      childrenNode = (
        <View className='cancelContent'>
          <View className='item item1'>删除商品</View>
          <View className='item item2'>确认删除该商品吗？</View>
        </View>
      )
    } else if (type === 'confirmDelivery') {
      childrenNode = (
        <View className='confirmContent confirmDelivery'>
          <View className='item item1'>确认收货？</View>
          <View className='item item2'>收货后将决定是否退款</View>
        </View>
      )
    } else if (type === 'confirmGetOrder') {
      childrenNode = (
        <View className='confirmContent'>
          <View className='item item1'>确认接单</View>
          <View className='item item2'>接单后将呼叫骑士到店取货</View>
        </View>
      )
    } else if (type === 'verification') {
      childrenNode = (
        <View className='verificationContent'>
          <View className='item item1'>自提订单核销</View>
          <View className='item item2'>请输入6位数的核销码</View>
          <View className='inputwrapper' id='inputwrapper'>
            <Input
              className='input'
              type='number'
              maxlength={6}
              onInput={this.handleChangeInputVericode}
            />
            <View
              className={classNames('bottom_line——wrapper', {
                ['hasError']: veriError
              })}
            >
              {this.state.veriCode.map((code, index) => (
                <View
                  className={classNames('bottom_line', {
                    [`active`]: index + 1 <= this.computedRealLength()
                  })}
                  key={`${index}${code}`}
                >
                  <Text className='number'>{code}</Text>
                </View>
              ))}
              {!!veriError && <View className='error'>{veriError}</View>}
            </View>
          </View>
          <View className='bottom'>
            <View className='wrapper-bottom' onClick={this.handleOnScanQRCode}>
              <Text className='iconfont icon-saoma'></Text>
              <Text className='text'>扫一扫</Text>
            </View>
          </View>
        </View>
      )
    } else if (type === 'canceldeliverystaff') {
      childrenNode = (
        <View className='confirmContent'>
          <View className='item item1'>取消配送</View>
          <View className='item item2'>取消配送后需重新分配配送员</View>
        </View>
      )
    } else if (type === 'confirmpackag') {
      childrenNode = (
        <View className='confirmContent'>
          <View className='item item1'>确认打包</View>
        </View>
      )
    }

    return (
      <View
        className={classNames('content', {
          [`cancelOrder`]: type === 'cancelOrder',
          [`confirmContent`]: type === 'confirmGetOrder' || type === 'confirmDelivery',
          [`verification`]: type === 'verification'
        })}
      >
        {childrenNode}
        {type === 'verification' && (
          <View className='iconfont icon-guanbi-01' onClick={this.handleClose}></View>
        )}
      </View>
    )
  }

  //拨打电话
  handleCallPhonenumber = () => {
    const {
      orderInfo: { mobile }
    } = this.props
    Taro.makePhoneCall({
      phoneNumber: mobile
    })
  }

  //取消弹窗
  handleClose = () => {
    const { onClose } = this.props
    onClose && onClose()
  }

  //点击确认收货
  handleConfirmDelivery = () => {
    const { orderInfo, maxOrderInfo } = this.props
    //处理售后
    Taro.navigateTo({
      url: `/pages/afterSales/deal?aftersalesNo=${
        orderInfo.aftersales_bn || maxOrderInfo.aftersales_bn
      }`
    })
  }

  //取消配送
  handleCancleDeliveryStaff = () => {
    const { orderInfo, onRefresh } = this.props
    console.log(orderInfo)
    requestCallback(
      async () => {
        const data = await api.order.canceldeliverystaff({ order_id: orderInfo.order_id })
        return data
      },
      '成功取消配送',
      () => {
        this.handleClose()
        onRefresh?.()
      }
    )
  }

  //已打包
  handleConfirmpackag = () => {
    const { orderInfo, onRefresh } = this.props
    console.log(orderInfo)
    requestCallback(
      async () => {
        const data = await api.order.confirmpackag({ order_id: orderInfo.order_id })
        return data
      },
      '打包成功',
      () => {
        this.handleClose()
        onRefresh?.()
      }
    )
  }

  handleGoodDelete = () => {
    const { goodInfo, onRefresh } = this.props
    requestCallback(
      async () => {
        const data = await api.weapp.delete_good(goodInfo.goods_id)
        return data
      },
      '删除商品成功',
      () => {
        this.handleClose()
        onRefresh?.()
      }
    )
  }

  //取消订单
  handleCancelOrder = () => {
    const { orderInfo, onRefresh } = this.props
    requestCallback(
      async () => {
        const data = await api.order.cancel({
          order_id: orderInfo.order_id
        })
        return data
      },
      '取消订单成功',
      () => {
        this.handleClose()
        onRefresh?.()
      }
    )
  }

  //点击确认取单
  handleGetOrder = () => {
    const { orderInfo, onRefresh } = this.props
    requestCallback(
      async () => {
        const data = await api.order.businessreceipt({
          orderId: orderInfo.order_id
        })
        return data
      },
      '接单成功',
      () => {
        this.handleClose()
        onRefresh?.()
      }
    )
  }

  renderAction = () => {
    let childrenNode = null

    const { type } = this.props

    if (type === 'phone') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item item1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item item2' onClick={this.handleCallPhonenumber}>
            确认拨打
          </View>
        </View>
      )
    } else if (type === 'cancelOrder') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item cancelitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item cancelitem2' onClick={this.handleCancelOrder}>
            确认取消
          </View>
        </View>
      )
    } else if (type === 'deleteGood') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item cancelitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item cancelitem2' onClick={this.handleGoodDelete}>
            确认删除
          </View>
        </View>
      )
    } else if (type === 'confirmGetOrder') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item confirmitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item confirmitem2' onClick={this.handleGetOrder}>
            接单
          </View>
        </View>
      )
    } else if (type === 'confirmDelivery') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item confirmitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item confirmitem2' onClick={this.handleConfirmDelivery}>
            确认并处理
          </View>
        </View>
      )
    } else if (type === 'verification') {
      childrenNode = null
    } else if (type === 'canceldeliverystaff') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item confirmitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item confirmitem2' onClick={this.handleCancleDeliveryStaff}>
            确认
          </View>
        </View>
      )
    } else if (type === 'confirmpackag') {
      childrenNode = (
        <View className='actionContent'>
          <View className='item confirmitem1' onClick={this.handleClose}>
            取消
          </View>
          <View className='item confirmitem2' onClick={this.handleConfirmpackag}>
            确认打包
          </View>
        </View>
      )
    }

    return childrenNode && <View className='action'>{childrenNode}</View>
  }

  //扫一扫
  handleOnScanQRCode = async () => {
    console.log('handleOnScanQRCode')
    const res = await qwsdk.scanQRCode()
    console.log('handleOnScanQRCode', res)
    requestCallback(
      async () => {
        const data = await api.order.qrwriteoff({
          code: res.replace('ZT_', '')
        })
        return data
      },
      '核销订单成功',
      ({ order_id }) => {
        this.handleClose()
        Taro.navigateTo({ url: `/pages/order/detail?order_id=${order_id}` })
      },
      () => {
        this.setState({
          veriError: '核销码不存在或有误，请检查！'
        })
      }
    )
  }

  render() {
    const { visible, onClose = () => {} } = this.props

    return (
      <View className={classNames('action-modal')}>
        <AtModal isOpened={visible} onClose={onClose}>
          {this.renderContent()}
          {this.renderAction()}
        </AtModal>
      </View>
    )
  }
}
