/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { getThemeStyle } from '@/utils'
import FilterBlock from './comps/filterblock'
import { ORDER_LIST_CANCEL_REASON } from '@/consts'
import { withPager, withBackToTop } from '@/hocs'
import { SpLoading, SpNote, SpOrderItem, SpTips, SpToast } from '@/components'
import { SelectInput, Tabbar, PageActionButtons } from '@/components/sp-page-components'
import { calculateTimestamp } from '@/utils/time'
import { classNames } from '@/utils'
import api from '@/api'
import { connect } from 'react-redux'
import './index.scss'

@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
@withPager
@withBackToTop
export default class List extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orderStatus: 0,
      noteVisible: false,
      actionVisible: false,
      actionType: '',
      orderList: [],
      currentOrder: {},
      loading: false,
      //搜索框选择的参数  类型为对象
      inputParams: null,
      //搜索框输入的值
      inputValue: '',
      //状态筛选值
      mainStatus: null,
      //筛选参数
      filterParams: {},
      //点击picker隐藏
      pickerVisible: false,
      //默认订单由近及远
      orderBy: 'desc',
      //picker的标题
      pickerTitle: '操作弹框',
      //取消订单的数据列
      cancelData: ORDER_LIST_CANCEL_REASON,
      //取消订单的选择原因
      cancelReason: '',
      //页面类型
      pageType: 'orderList',
      //按钮操作弹框显示隐藏
      buttonsActionVisible: false
    }
  }

  //获取订单筛选参数
  getOrderParams = () => {
    const { inputParams, inputValue, mainStatus, filterParams, orderBy } = this.state

    let params = {
      order_type: 'normal'
    }

    if (inputParams && inputValue) {
      params[inputParams.value] = inputValue
    }

    if (mainStatus && mainStatus.value !== 'all') {
      params['main_status'] = mainStatus.value
    }

    if (orderBy) {
      params['order_by'] = orderBy
    }

    if (filterParams.orderClass) {
      if (filterParams.orderClass !== 'all') {
        params['order_class'] = filterParams.orderClass
      }
    }

    // if (filterParams.receiptType) {
    //   params['receipt_type'] = filterParams.receiptType
    // }

    if (filterParams.orderTime) {
      let timeArr = calculateTimestamp(filterParams.orderTime)
      if (timeArr.length) {
        params['time_start_begin'] = timeArr[0]
        params['time_start_end'] = timeArr[1]
      }
    }

    return params
  }

  searchFilter = async ({ isCMD, isResetList, isFirst }) => {
    let query = {}

    if (isFirst) {
      return
    }

    if (isCMD) {
      //如果是初始化
      query.orderList = []
      query.inputValue = ''
    }

    if (isResetList) {
      //筛选时需要置空
      query.orderList = []
    }

    this.resetPage(() => {
      this.setState(
        {
          ...this.state,
          ...query
        },
        () => {
          this.nextPage()
        }
      )
    })
  }

  async componentDidShow() {
    const {
      router: { params }
    } = getCurrentInstance()

    await this.searchFilter({ isCMD: true, isFirst: true })
  }

  handleTabClick = (activeIndex) => {
    this.setState({
      orderStatus: activeIndex
    })
  }

  //获取订单列表
  getOrdersList = async (params) => {
    let { distributor_id } = this.props.planSelection
    const {
      list,
      pager: { count: total }
    } = await api.order.list({
      page: params.page_no,
      pageSize: params.page_size,
      distributor_id,
      receipt_type: 'ziti',
      ...this.getOrderParams()
    })
    this.setState({
      orderList: [...this.state.orderList, ...list]
    })

    return {
      total
    }
  }

  //请求
  fetch = async (params) => {
    this.setState({
      loading: true
    })

    const { total } = await this.getOrdersList(params)

    this.setState({
      loading: false
    })

    return { total }
  }

  //搜索参数变化回调
  handleParamChange = (inputParams) => {
    this.setState({
      inputParams: { ...inputParams }
    })
  }

  //值变化回调
  handleValueChange = (inputValue) => {
    this.setState({
      inputValue
    })
  }

  //状态变化的回调
  handleStatusChange = (status) => {
    this.setState({
      mainStatus: status
    })
    this.searchFilter({ isResetList: true })
  }

  handleRefresh = () => {
    this.searchFilter({ isResetList: true })
  }

  //提交筛选状态
  handleSubmitParams = (params) => {
    this.setState({
      filterParams: params
    })
    this.searchFilter({ isResetList: true })
  }

  //切换时间筛选
  orderClick = () => {
    const { orderBy } = this.state
    if (orderBy === 'desc') {
      this.setState(
        {
          orderBy: 'asc'
        },
        () => {
          this.searchFilter({ isResetList: true })
        }
      )
    } else {
      this.setState(
        {
          orderBy: 'desc'
        },
        () => {
          this.searchFilter({ isResetList: true })
        }
      )
    }
  }

  //点击商品列表
  handleClickGoodItem = (goodInfo) => {
    Taro.navigateTo({ url: `/pages/order/detail?order_id=${goodInfo.order_id}` })
  }

  //点击操作按钮
  handleClickActionButtons = (e) => {
    console.log('handleClickActionButtons')

    this.setState({
      buttonsActionVisible: true
    })
  }

  //关闭操作弹框
  handleCloseActionButtons = () => {
    this.setState({
      buttonsActionVisible: false
    })
  }

  render() {
    const {
      orderList,
      page,
      loading,
      inputParams,
      inputValue,
      mainStatus,
      orderBy,
      pageType,
      buttonsActionVisible
    } = this.state

    console.log('buttonsActionVisible', buttonsActionVisible)
    return (
      <View className='page-order-list' style={getThemeStyle()}>
        <View className='page-order-list-input'>
          <SelectInput
            inputParam={inputParams}
            inputValue={inputValue}
            pageType={pageType}
            paramChange={this.handleParamChange}
            valueChange={this.handleValueChange}
            onInputConfirm={this.searchFilter}
          />
        </View>

        <Tabbar
          pageType={pageType}
          mainStatus={mainStatus}
          statusChange={this.handleStatusChange}
        />

        <FilterBlock
          pageType={pageType}
          orderBy={orderBy}
          onSubmitParams={this.handleSubmitParams}
          onOrderClick={this.orderClick}
        />

        <ScrollView
          scrollY
          className={classNames('page-order-list-orderList', {
            ['show-buttonsaction']: buttonsActionVisible
          })}
          scrollWithAnimation
          onScrollToLower={this.nextPage}
        >
          {orderList.map((orderItem, index) => {
            return (
              <SpOrderItem
                key={`${orderItem.order_id}_${index}`}
                pageType={pageType}
                info={orderItem}
                onGoodItemClick={this.handleClickGoodItem}
                renderFooter={
                  <PageActionButtons
                    buttons={orderItem?.app_info?.buttons}
                    pageType={pageType}
                    onClick={this.handleClickActionButtons}
                    onClose={this.handleCloseActionButtons}
                    orderInfo={orderItem}
                    mainStatus={mainStatus}
                    onRefresh={this.handleRefresh}
                  />
                }
              />
            )
          })}

          {loading && <SpLoading>正在加载...</SpLoading>}

          {!page.isLoading && !page.hasNext && !orderList.length && (
            <SpNote img='no_order.png'>暂时还没有您的订单信息</SpNote>
          )}

          {!page.hasNext && !!orderList.length && <SpTips msg={'没有更多了哦~'}></SpTips>}
        </ScrollView>

        <SpToast />
      </View>
    )
  }
}
