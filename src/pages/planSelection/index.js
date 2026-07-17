/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, ScrollView, Input, Text } from '@tarojs/components'
import api from '@/api'
import Taro from '@tarojs/taro'
import { SpRadio, SpLoading, SpNote, SpToast } from '@/components'
import { ShopxLogo } from '@/components/sp-page-components'
import { connect } from 'react-redux'
import './index.scss'
import S from '@/spx'

/** 只展示 is_valid 明确为 true / false 的门店（含字符串与 0/1），其余状态不展示 */
function isValidExplicitTrueOrFalse(v) {
  if (v === true || v === false) return true
  if (v === 1 || v === 0) return true
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    return s === 'true' || s === 'false' || s === '1' || s === '0'
  }
  return false
}

function filterShopsValidTrueOrFalseOnly(list) {
  if (!Array.isArray(list)) return []
  return list.filter((item) => isValidExplicitTrueOrFalse(item?.is_valid))
}

function filterShopsByKeyword(list, keyword) {
  const validList = filterShopsValidTrueOrFalseOnly(list)
  const trimmed = (keyword || '').trim()
  if (!trimmed) return validList
  const lowerKeyword = trimmed.toLowerCase()
  return validList.filter((item) => (item?.name || '').toLowerCase().includes(lowerKeyword))
}

@connect(
  ({ planSelection }) => ({
    planSelection
  }),
  (dispatch) => ({
    add: (activeShop) => dispatch({ type: 'planSelection/activeShop', payload: activeShop })
  })
)
export default class PlanSelection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isActive: null,
      allShopList: [],
      shopList: [],
      searchKeyword: '',
      loading: false
    }
  }

  onSearchChange = (value) => {
    this.setState((prevState) => ({
      searchKeyword: value,
      shopList: filterShopsByKeyword(prevState.allShopList, value)
    }))
  }

  onSearchClear = () => {
    this.onSearchChange('')
  }

  activeHandle = async (activeShop) => {
    this.props.add(activeShop)
    this.setState({
      isActive: activeShop.distributor_id
    })
    await api.operator.selectDistributor({
      set_distributor_id: activeShop.distributor_id
    })
    Taro.redirectTo({ url: `/pages/index` })
  }
  async getPlanSelectionHanle() {
    this.setState({
      loading: true
    })
    let data = {
      is_app: 1,
      is_all: true
    }
    console.log('===', S.getAuthToken())
    const result = await api.planSelection.getShopList(data)
    console.log(result)
    const allShopList = result.list || []
    this.setState((prevState) => ({
      allShopList,
      shopList: filterShopsByKeyword(allShopList, prevState.searchKeyword),
      loading: false
    }))
  }

  componentDidMount() {
    this.getPlanSelectionHanle()
  }

  render() {
    const { isActive, allShopList, shopList, searchKeyword, loading } = this.state
    return (
      <View className='page-planSelection'>
        <View className='welcome-scrollview' scrollY scrollWithAnimation>
          <View className='title'>选择您的店铺工作台</View>
          <View className='tips'>没有找到？请联系您的超级管理员</View>
          <View className='search-bar'>
            <View className='search-input'>
              <Text className='iconfont icon-sousuo search-input__icon'></Text>
              <Input
                className='search-input__field'
                type='text'
                placeholder='搜索店铺名称'
                value={searchKeyword}
                confirmType='search'
                onInput={(e) => this.onSearchChange(e.detail.value)}
              />
              {!!searchKeyword && (
                <Text
                  className='iconfont icon-qingchu search-input__clear'
                  onClick={this.onSearchClear}
                ></Text>
              )}
            </View>
          </View>

          <ScrollView className='box' scrollY scrollWithAnimation>
            {loading && <SpLoading>正在加载...</SpLoading>}
            {!loading && shopList.length > 0 && (
              <SpRadio
                isActive={isActive}
                SpRadioData={shopList}
                activeHandle={this.activeHandle}
              ></SpRadio>
            )}
            {!loading && allShopList.length <= 0 && (
              <SpNote img='no_order.png'>快去添加店铺吧~</SpNote>
            )}
            {!loading && allShopList.length > 0 && shopList.length <= 0 && (
              <SpNote img='no_order.png'>未找到相关店铺</SpNote>
            )}
          </ScrollView>
        </View>
        <ShopxLogo />
        <SpToast />
      </View>
    )
  }
}
