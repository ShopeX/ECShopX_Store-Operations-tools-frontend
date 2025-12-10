/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'

export default class SpTabBar extends Component {
  componentDidMount() {
    this.initTabbarData()
  }
}
