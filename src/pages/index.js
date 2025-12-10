/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import {
  requestCallback,
  qwsdk,
  setWeapp,
  isFromWebapp,
  navigateTo,
  cleanWeapp,
  VERSION_PLATFORM,
  VERSION_STANDARD,
  isIos
} from '@/utils'
import { SpToast, SpModal } from '@/components'
import { connect } from 'react-redux'

import S from '@/spx'
import './index.scss'

@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
// @withLogin()
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moneyShow: true,
      realTimeData: {
        real_payed_fee: 0, //  实付金额
        real_payed_orders: 0, // 支付订单数
        real_payed_members: 0, // 实付会员数
        real_atv: 0, // 客单价
        real_refunded_fee: 0, //退款金额
        real_aftersale_count: 0, //售后订单数
        real_deposit: 0 // 新增储蓄
      },
      loading: true,
      apis: {
        aftersales: '',
        order: '',
        items: undefined,
        order_ziti: undefined
      },
      is_center: false,
      currentModal: {
        visible: '',
        status: '',
        shopList: [],
        order_info: {}
      },
      is_salesman: false
    }
  }

  componentDidMount() {
    // const { href } = window.location
    // if (S.getAuthToken()) {
    //   qwsdk.register({
    //     url: href
    //   })
    // }
  }

  async componentDidShow() {
    setWeapp()
    if (isFromWebapp()) {
      const { app_id, app_type, company_id, openid, unionid, token } = S.get('WEBAPP', true)
      // let data
      if (token) {
        S.setAuthToken(token)
        // const { href, origin, search } = window.location
        // const sdkAuthUrlIos = Taro.getStorageSync('sdk_auth_url_ios')
        // console.log('sdkAuthUrlIos:', sdkAuthUrlIos)
        // qwsdk.register({
        //   url: isIos() ? `${sdkAuthUrlIos}` : href
        // })
      }
      // if (!S.getAuthToken()) {
      //   data = await api.weapp.is_bind({
      //     app_id,
      //     app_type,
      //     company_id,
      //     openid,
      //     unionid
      //   })
      //   // if (company_id) {
      //   //   Taro.setStorageSync('company_id', company_id)
      //   // }
      //   if (data.token) {
      //     S.setAuthToken(data.token)
      //     const { href } = window.location
      //     qwsdk.register({
      //       url: href
      //     })
      //   }
      // }
    } else {
      const { href } = window.location
      const { company_id } = getCurrentInstance().router.params || {}
      console.log('首页:componentDidMount:params1111112', getCurrentInstance().router, company_id)
      if (company_id) {
        Taro.setStorageSync('company_id', company_id)
      }
      console.log('page_index:componentDidMount:qwsdk.register1', href)
    }

    this.getConfig()
    this.salesman()
  }

  async salesman() {
    let { distributor_id } = this.props.planSelection

    if (distributor_id != null) {
      const result = await api.salesman.storemanagerinfo({
        distributor_id,
        page: 1,
        page_size: 1000
      })
      this.setState({
        is_salesman: result?.manage_status == 1 ? true : false
      })
    } else {
      Taro.redirectTo({ url: `/pages/planSelection/index` })
    }
  }

  async getConfig() {
    let { distributor_id } = this.props.planSelection
    if (distributor_id != null) {
      const result = await api.home.getStatistics({ shop_id: distributor_id, is_app: 1 })
      this.setState({
        realTimeData: result.today_data,
        apis: result.apis
      })
    } else {
      Taro.redirectTo({ url: `/pages/planSelection/index` })
    }
  }

  switchHandle() {
    this.setState({
      moneyShow: !this.state.moneyShow
    })
  }
  goOrderPageHandle() {
    Taro.navigateTo({
      url: '/pages/order/list'
    })
  }

  goAfterSalesPageHandle = () => {
    Taro.navigateTo({
      url: '/pages/afterSales/list'
    })
  }

  formatA(num) {
    var result = parseFloat(num)
    if (isNaN(result)) {
      console('传递参数错误，请检查！')
      return false
    }
    result = Math.round(num * 100) / 100
    var s_x = result.toString()
    var pos_decimal = s_x.indexOf('.')
    if (pos_decimal < 0) {
      pos_decimal = s_x.length
      s_x += '.'
    }
    while (s_x.length <= pos_decimal + 2) {
      s_x += '0'
    }
    return s_x
  }

  handleOnScanQRCode = async () => {
    console.log('clicl:handleOnScanQRCode')

    const res = await qwsdk.scanQRCode()
    // const res = 'excode:65796-2124869866'
    console.log('code', res)
    const str = 'excode:'
    if (res && res.indexOf(str) == -1) {
      requestCallback(
        async () => {
          const data = await api.order.qrwriteoff({
            code: res.replace('ZT_', '')
          })
          return data
        },
        '核销订单成功',
        ({ order_id }) => {
          Taro.navigateTo({ url: `/pages/order/detail?order_id=${order_id}` })
        },
        () => {
          this.setState({
            veriError: '核销码不存在或有误，请检查！'
          })
        }
      )
    } else if (res && res.indexOf(str) != -1) {
      let { distributor_id } = this.props.planSelection
      try {
        const result = await api.home.checkCode({
          code: res.slice(7),
          distributor_id
        })
        if (!result.status) {
          this.setState({
            currentModal: {
              visible: true,
              status: 'fail',
              shopList: result.distributors.list
            }
          })
        } else {
          this.setState({
            currentModal: {
              visible: true,
              status: 'success',
              order_info: result.order_info.items
            }
          })
        }
      } catch (error) {
        this.setState({
          veriError: '核销码不存在或有误，请检查！'
        })
      }
    }
  }
  handleCancel = () => {
    this.setState({
      currentModal: {
        visible: '',
        status: '',
        shopList: [],
        order_info: {}
      }
    })
  }
  // 查看订单详情
  orderInfoHandle = (order_id) => {
    Taro.navigateTo({ url: `/pages/order/detail?order_id=${order_id}` })
  }

  render() {
    const { moneyShow, realTimeData, loading, apis, is_center, currentModal, is_salesman } =
      this.state

    const { name, logo, distributor_id } = this.props.planSelection
    return (
      <View className='page-index'>
        <>
          <View className='top'>
            <View className='shop-title'>
              <View className='avatar'>
                <Image className='photo' src={logo}></Image>
              </View>
              <View className='title'>{name}</View>
            </View>
          </View>
          <View className='current-status'>
            <View className='big-title'>
              <View className='iconfont icon-gaikuang'></View>
              <Text>实时概况</Text>
            </View>
            <View className='spend-money'>
              <View className='title'>
                <Text>实付金额（元）</Text>
                {moneyShow ? (
                  <View
                    className='iconfont icon-yincang'
                    onClick={() => {
                      this.switchHandle()
                    }}
                  ></View>
                ) : (
                  <View
                    className='iconfont icon-xianshi'
                    onClick={() => {
                      this.switchHandle()
                    }}
                  ></View>
                )}
              </View>
              <View className='money'>
                {moneyShow ? (
                  <Text>{this.formatA(realTimeData.real_payed_fee / 100)}</Text>
                ) : (
                  <Text>****</Text>
                )}
              </View>
            </View>
            <View className='list'>
              <View className='pay-order'>
                <View className='title'>支付订单（笔）</View>
                <View className='color-white'>{realTimeData.real_payed_orders}</View>
              </View>
              <View className='pay-order'>
                <View className='title'>售后订单（笔）</View>
                <View className='color-white'>{realTimeData.real_aftersale_count}</View>
              </View>
            </View>

            <View className='list list-2'>
              <View className='pay-order'>
                <View className='title'>退款（元）</View>

                <View className='color-gray'>
                  {this.formatA(realTimeData.real_refunded_fee / 100)}
                </View>
              </View>
              <View className='pay-order'>
                <View className='title'>实付会员（人）</View>
                <View className='color-gray'>{realTimeData.real_payed_members}</View>
              </View>
            </View>
            <View className='list list-2'>
              <View className='pay-order'>
                <View className='title'>客单价（元）</View>
                <View className='color-gray'>{this.formatA(realTimeData.real_atv / 100)} </View>
              </View>
              <View className='pay-order'>
                {is_center && (
                  <>
                    <View className='title'>新增储值（元）</View>
                    <View>{this.formatA(realTimeData.real_deposit / 100)}</View>
                  </>
                )}
              </View>
            </View>
          </View>
          <View className='func-list'>
            <View className='title'>常用功能</View>
            <View className='list'>
              {/* {apis.items == 1 && VERSION_PLATFORM && ( */}
              {apis.items == 1 && VERSION_STANDARD && (
                <View className='item' onClick={() => navigateTo('/pages/good/list')}>
                  <View>
                    <Image className='img' src={require('@/assets/imgs/index/good.png')}></Image>
                  </View>
                  <View className='subtitle'>商品管理</View>
                </View>
              )}
              {apis.order == 1 && (
                <View className='item' onClick={this.goOrderPageHandle}>
                  <View>
                    <Image className='img' src={require('@/assets/imgs/index/dingdan.png')}></Image>
                  </View>
                  <View className='subtitle'>订单管理</View>
                </View>
              )}
              {apis.aftersales == 1 && (
                <View className='item' onClick={this.goAfterSalesPageHandle}>
                  <View>
                    <Image className='img' src={require('@/assets/imgs/index/shouhou.png')}></Image>
                  </View>
                  <View className='subtitle'>售后管理</View>
                </View>
              )}
              {apis.order == 1 && (
                <View className='item' onClick={this.handleOnScanQRCode.bind(this)}>
                  <View className='img_'>
                    <Image
                      className='img'
                      src={require('@/assets/imgs/index/shaoyishao.png')}
                    ></Image>
                  </View>
                  <View className='subtitle'>自提核销</View>
                </View>
              )}
              {apis.order_ziti == 1 && (
                <View className='item' onClick={() => navigateTo('/pages/order/ziti-list')}>
                  <View className='img_'>
                    <Image className='img' src={require('@/assets/imgs/ziti-order.png')}></Image>
                  </View>
                  <View className='subtitle'>自提订单</View>
                </View>
              )}
              {/* {VERSION_STANDARD && (
                <View
                  className='item'
                  onClick={() => {
                    wx.miniProgram.navigateTo({
                      url: `/subpages/dianwu/list?token=${S.getAuthToken()}&distributor_id=${distributor_id}`
                    })
                  }}
                >
                  <View className='img_'>
                    <Image
                      className='img'
                      src={require('@/assets/imgs/icon_goods_search.png')}
                    ></Image>
                  </View>
                  <View className='subtitle'>商品查询</View>
                </View>
              )} */}
              {VERSION_STANDARD && (
                <View
                  className='item'
                  onClick={() => {
                    wx.miniProgram.navigateTo({
                      url: `/subpages/dianwu/cashier?token=${S.getAuthToken()}&distributor_id=${distributor_id}`
                    })
                  }}
                >
                  <View className='img_'>
                    <Image className='img' src={require('@/assets/imgs/icon_cashier.png')}></Image>
                  </View>
                  <View className='subtitle'>收银台</View>
                </View>
              )}
              {/* {VERSION_STANDARD && (
                <View
                  className='item'
                  onClick={() =>
                    wx.miniProgram.navigateTo({
                      url: `/subpages/dianwu/pending-checkout?token=${S.getAuthToken()}&distributor_id=${distributor_id}&from=home`
                    })
                  }
                >
                  <View className='img_'>
                    <Image
                      className='img'
                      src={require('@/assets/imgs/icon_fetch_order.png')}
                    ></Image>
                  </View>
                  <View className='subtitle'>取单</View>
                </View>
              )} */}
              {VERSION_STANDARD && (
                <View
                  className='item'
                  onClick={() => {
                    debugger
                    wx.miniProgram.navigateTo({
                      url: `/subpages/dianwu/delivery-personnel?token=${S.getAuthToken()}&distributor_id=${distributor_id}&name=${name}`
                    })
                  }}
                >
                  <View className='img_'>
                    <Image className='img' src={require('@/assets/imgs/delivery.png')}></Image>
                  </View>
                  <View className='subtitle'>配送管理</View>
                </View>
              )}
              {VERSION_STANDARD && is_salesman && (
                <View
                  className='item'
                  onClick={() => {
                    debugger
                    wx.miniProgram.navigateTo({
                      url: `/subpages/dianwu/salesman-personnel?token=${S.getAuthToken()}&distributor_id=${distributor_id}&name=${name}`
                    })
                  }}
                >
                  <View className='img_'>
                    <Image className='img' src={require('@/assets/imgs/salesman.png')}></Image>
                  </View>
                  <View className='subtitle'>业务员管理</View>
                </View>
              )}
              <View
                className='item'
                onClick={async () => {
                  wx.miniProgram.navigateTo({
                    url: `/subpages/dianwu/activity-code?token=${S.getAuthToken()}`
                  })
                }}
              >
                <View className='img_'>
                  <Image
                    className='img'
                    src={require('@/assets/imgs/index/shaoyishao.png')}
                  ></Image>
                </View>
                <View className='subtitle'>报名核销</View>
              </View>

              <SpToast />
            </View>
          </View>
          <SpModal
            currentModal={currentModal}
            handleCancel={this.handleCancel}
            orderInfoHandle={this.orderInfoHandle}
          ></SpModal>
        </>
      </View>
    )
  }
}

export default Index
