/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { AtTabs } from 'taro-ui'
import { View } from '@tarojs/components'
import { ZITI_ORDER_LIST_STATUS, afterSales } from '@/consts'
import './index.scss'

const getListAboutPage = (pageType) => {
  let returnArr = []
  if (pageType === 'orderList') {
    returnArr = Object.keys(ZITI_ORDER_LIST_STATUS).map((key) => ({
      value: key,
      label: ZITI_ORDER_LIST_STATUS[key]
    }))
  } else if (pageType === 'afterSalesList') {
    returnArr = Object.keys(afterSales.LIST_STATUS).map((key) => ({
      value: key,
      label: afterSales.LIST_STATUS[key]
    }))
  }
  return returnArr
}

class Tabbar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: []
    }
  }

  componentDidMount() {
    const { pageType, mainStatus, statusChange = () => {} } = this.props
    const dataSource = getListAboutPage(pageType)
    if (!mainStatus) {
      statusChange(dataSource[0], true)
    }
    this.setState({
      dataSource
    })
  }

  //发现点的下标
  findIndex = () => {
    const { dataSource } = this.state
    const { mainStatus = {} } = this.props
    const currentIndex = dataSource.findIndex((item) => item.label === mainStatus.label)
    return currentIndex
  }

  //渲染list
  renderTabList = () => {
    const { dataSource } = this.state
    return dataSource.map((d) => ({ title: d.label }))
  }

  //点击tabs
  handleTabClick = (currentIndex) => {
    const { dataSource } = this.state
    const { statusChange = () => {} } = this.props
    statusChange(dataSource[currentIndex])
  }

  render() {
    return (
      <View className='sp-component-tabbar'>
        <View className='left'></View>
        <AtTabs
          current={this.findIndex()}
          scroll
          tabList={this.renderTabList()}
          onClick={this.handleTabClick}
        ></AtTabs>
        <View className='right'></View>
      </View>
    )
  }
}

export default Tabbar
