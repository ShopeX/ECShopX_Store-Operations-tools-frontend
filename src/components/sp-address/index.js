/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { Component, createElement } from 'react'
import { View, ScrollView, Image, Form, Input, Button } from '@tarojs/components'
import { showToast } from '@/utils'
import api from '@/api'
import './index.scss'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
// import { connect } from 'react-redux'

// @connect(({ planSelection }) => ({
//   planSelection
// }))
export default class SpAddress extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      isActive: 0
    }
  }

  notUpdate(message) {
    showToast(`${message}暂不支持修改！`)
  }

  render() {
    const { addressList, switchAddressHandle, index } = this.props
    return (
      <View className='sp-address'>
        <View
          className='item'
          key={addressList.address_id}
          onClick={(e) => switchAddressHandle(index)}
        >
          <View className={'btn ' + (addressList.is_default === '1' && 'active')}>
            <View className='right iconfont icon-gouxuan-01'></View>
          </View>
          <View className='address'>
            <View className='title'>
              {addressList.province + addressList.city + addressList.area + addressList.address}
            </View>
            <View className='name_tel'>{addressList.contact + '  ' + addressList.mobile}</View>
          </View>
        </View>
      </View>
    )
  }
}
