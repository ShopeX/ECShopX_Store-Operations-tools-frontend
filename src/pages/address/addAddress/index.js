/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { Component, createElement } from 'react'
import { View, Image, Form, Input, Button, Picker, ScrollView } from '@tarojs/components'
import { showToast } from '@/utils'
import api from '@/api'
import { SpAddress, SpEditForm } from '@/components'
import './index.scss'

import Taro from '@tarojs/taro'

export default class Add_Address extends Component {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {
    // this.getConfig()
  }

  notUpdate(message) {
    showToast(`${message}暂不支持修改！`)
  }

  render() {
    return (
      <View className='page-addAddress'>
        <SpEditForm></SpEditForm>
      </View>
    )
  }
}
