/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { showToast } from '@/utils'
import api from '@/api'
import { SpAddress, SpLoading } from '@/components'
import { connect } from 'react-redux'
import './index.scss'

@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
export default class Address extends Component {
  constructor() {
    super()
    this.state = {
      addressList: null,
      isActive: null,
      loading: false
    }
  }
  componentDidShow() {
    this.getConfig()
  }

  notUpdate(message) {
    showToast(`${message}暂不支持修改！`)
  }
  async getConfig() {
    this.setState({
      loading: true
    })
    let { distributor_id } = this.props.planSelection
    const data = {
      distributor_id,
      page_size: 1000
    }
    const result = await api.address.getAddressList(data)
    this.setState({
      loading: false
    })
    this.setState({
      addressList: result.list
    })
    console.log(result)
  }
  incrementAddress() {
    Taro.navigateTo({
      url: `/pages/address/addAddress/index`
    })
  }
  isShowEditHandle() {
    Taro.navigateTo({
      url: `/pages/address/index`
    })
  }
  switchAddressHandle(index) {
    const data = this.state.addressList.map((item, indey) => {
      if (index == indey) {
        item.is_default = '1'
      } else {
        item.is_default = '2'
      }
      return item
    })

    this.setState({
      addressList: data
    })
  }
  async seletedHandle() {
    // 选中的address;
    const data = this.state.addressList.filter((item) => {
      return item.is_default == '1'
    })
    const { address_id } = data[0]
    const result = await this.seletedAddress(address_id)
    if (result.status) {
      Taro.navigateTo({
        url: `/pages/afterSales/deal?address_id=${address_id}`
      })
    }
  }
  // 选中地址
  async seletedAddress(address_id) {
    console.log(address_id)
    const params = {
      address_id,
      set_default: 1
    }
    const result = await api.address.updateAddressActive(params)
    return result
  }

  render() {
    return (
      <View className='page-address'>
        {this.state.loading && <SpLoading>正在加载...</SpLoading>}
        <View className='nav'>
          <View className='left'>我的售后地址</View>
          <View
            className='iconfont icon-xinzengdizhi right'
            onClick={(e) => this.incrementAddress()}
          >
            {' '}
            新增地址
          </View>
        </View>
        {this.state.addressList ? (
          <ScrollView className='addressBox'>
            {this.state.addressList.map((item, index) => {
              return (
                <SpAddress
                  key={index}
                  index={index}
                  switchAddressHandle={this.switchAddressHandle.bind(this)}
                  addressList={item}
                ></SpAddress>
              )
            })}
          </ScrollView>
        ) : (
          <View>暂无地址</View>
        )}

        <View className='confirm'>
          <View className='btn' onClick={(e) => this.seletedHandle()}>
            选择此地址
          </View>
        </View>
        {/* <AtFloatLayout isOpened={this.state.isShow}>
          <SpEditForm
            seletedAddress={this.seletedAddress}
            getConfig={(e) => this.getConfig()}
            isShowEditHandle={(e) => this.isShowEditHandle()}
          ></SpEditForm>
        </AtFloatLayout> */}
      </View>
    )
  }
}
