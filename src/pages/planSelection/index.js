/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, ScrollView } from '@tarojs/components'
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
      shopList: [],
      loading: false
    }
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
    this.setState({
      shopList: filterShopsValidTrueOrFalseOnly(result.list),
      loading: false
    })
  }

  componentDidMount() {
    this.getPlanSelectionHanle()
  }

  render() {
    const { isActive, shopList, loading } = this.state
    return (
      <View className='page-planSelection'>
        <View className='welcome-scrollview' scrollY scrollWithAnimation>
          <View className='title'>选择您的店铺工作台</View>
          <View className='tips'>没有找到？请联系您的超级管理员</View>

          <ScrollView className='box'>
            {loading && <SpLoading>正在加载...</SpLoading>}
            {shopList.length > 0 && (
              <SpRadio
                isActive={isActive}
                SpRadioData={shopList}
                activeHandle={this.activeHandle}
              ></SpRadio>
            )}
            {shopList.length <= 0 && <SpNote img='no_order.png'>快去添加店铺吧~</SpNote>}
          </ScrollView>
        </View>
        <ShopxLogo />
        <SpToast />
      </View>
    )
  }
}
