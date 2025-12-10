/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { SpFilterDrawer } from '@/components'
import {
  ORDER_LIST_FILTER_TIME,
  ORDER_LIST_FILTER_CLASS,
  ORDER_LIST_RECEIPT_TYPE,
  ZITI_ORDER_LIST_FILTER_ITEM
} from '@/consts'
import './index.scss'

const filterListData = Object.keys(ZITI_ORDER_LIST_FILTER_ITEM).map((filterItem) => {
  let itemLabel = ZITI_ORDER_LIST_FILTER_ITEM[filterItem]
  let itemValue = filterItem
  let dataSource = []
  if (itemValue === 'orderTime') {
    dataSource = Object.keys(ORDER_LIST_FILTER_TIME).map((item) => ({
      label: ORDER_LIST_FILTER_TIME[item],
      value: item
    }))
  } else if (itemValue === 'goodList') {
    dataSource = Object.keys(ORDER_LIST_FILTER_CLASS).map((item) => ({
      label: ORDER_LIST_FILTER_CLASS[item],
      value: item
    }))
  } else {
    dataSource = Object.keys(ORDER_LIST_RECEIPT_TYPE).map((item) => ({
      label: ORDER_LIST_RECEIPT_TYPE[item],
      value: item
    }))
  }
  return {
    itemLabel,
    itemValue,
    dataSource
  }
})

export default class FilterBlock extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showFilter: false,
      filterParams: {}
    }
  }

  handleShowDrawer = () => {
    this.setState({
      showFilter: true
    })
  }

  handleCloseDrawer = () => {
    this.setState({
      showFilter: false
    })
  }

  filterData = () => {
    const { pageType } = this.props
    if (pageType === 'orderList') {
      return filterListData
    } else if (pageType === 'goodList') {
      return [
        {
          itemLabel: '上下架状态',
          itemValue: 'approve_status',
          dataSource: [
            { value: '', label: '全部' },
            { value: 'onsale', label: '上架' },
            { value: 'instock', label: '下架' }
          ]
        }
      ]
    }
  }

  //点击确认筛选
  handleSubmitParams = (params) => {
    const { onSubmitParams = () => {} } = this.props
    onSubmitParams(params)
    this.setState({
      showFilter: false
    })
  }

  //筛选由近及远
  renderOrderDesc = () => {
    let result = '订单时间'

    const { orderBy } = this.props

    if (orderBy === 'desc') {
      result += '由近到远'
    } else {
      result += '由远到近'
    }

    return result
  }

  render() {
    const { showFilter } = this.state

    const { pageType, onOrderClick = () => {}, orderBy } = this.props

    return (
      <View className='filterContent'>
        <View className='comp-order-list-filterBlock'>
          {orderBy ? (
            <View className='title'>
              <View className='icon1' onClick={onOrderClick}>
                <Text className='iconfont icon-shaixuan1'></Text>
              </View>
              <Text className='text'>{this.renderOrderDesc()}</Text>
            </View>
          ) : (
            <View className='_empty'></View>
          )}
          <View className='filterTip' onClick={this.handleShowDrawer}>
            <View className='iconfont icon-shaixuan2'></View>
            <View className='text'>筛选</View>
          </View>
        </View>

        <SpFilterDrawer
          pageType={pageType}
          filterTitle='订单筛选'
          filterData={this.filterData()}
          visible={showFilter}
          onCloseDrawer={this.handleCloseDrawer}
          onConfirm={this.handleSubmitParams}
        />
      </View>
    )
  }
}
