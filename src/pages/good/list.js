/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import { ScrollView, View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { SpTab, SpNote, SpToast } from '@/components'
import { SelectInput, CommonButton } from '@/components/sp-page-components'
import ActionModal from '@/components/sp-page-components/page-action-buttons/ActionModal'
import { getThemeStyle, pickBy, showToast } from '@/utils'
import { navigateToGoodForm } from './util'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import { usePage, useDepChange } from '@/hooks'
import FilterBlock from '../order/list/comps/filterblock'
import doc from '@/doc'
import { AtSwipeAction } from 'taro-ui'
import { Item as GoodItem } from './comps'
import api from '@/api'
import './list.scss'

//页面类型
const PAGE_TYPE = 'goodList'

const TAB_LIST = [
  { value: 'mendian', label: '门店商品' },
  { value: 'pingtai', label: '平台商品' }
]

const ACTION_LIST = [
  { label: '删除', plain: true, type: 'delete' },
  { label: '编辑', plain: true, type: 'edit' }
]

const SHELVES = [{ label: '上架', type: 'onsale' }]
const DIFF_SHELVES = [{ label: '下架', type: 'instock' }]

const AUDIT_PEROCESS = [{ label: '审核中', type: 'processing' }]
const AUDIT_REJECTED = [{ label: '审核驳回', type: 'rejected' }]

const initState = {
  //搜索框选择的参数  类型为对象
  inputParams: null,
  //搜索框输入的值
  inputValue: undefined,
  list: [],
  //tab切换
  activeIndex: 0,
  //筛选参数
  filterParams: null,
  visible: false
}

const List = () => {
  const [state, setState] = useImmer(initState)

  const { inputParams, inputValue, list, activeIndex, filterParams, visible } = state

  const handleParamChange = (inputParams) => {
    setState((_val) => {
      _val.inputParams = { ...inputParams }
    })
  }

  const {
    activeShop: { distributor_id }
  } = useSelector((state) => state.planSelection)

  const fetch = async ({ pageIndex, pageSize }) => {
    let synthetic = {}
    if (inputParams && inputValue) {
      synthetic[inputParams.value] = inputValue
    }
    let audit_status = filterParams?.approve_status ? 'approved' : undefined
    const params = {
      page: pageIndex,
      pageSize,
      item_type: 'normal',
      is_warning: 0,
      is_gift: false,
      type: 0,
      distributor_id,
      audit_status,
      ...(filterParams || {}),
      ...synthetic
    }
    const { list, total_count } = await api.weapp.good_list(params)

    await setState((_val) => {
      _val.list = _val.list.concat(pickBy(list, doc.good.GOOD_LIST))
    })

    return { total: total_count }
  }

  const { page, getTotal, nextPage, resetPage, nextPageForce } = usePage({
    fetch
  })

  useDidShow(async () => {
    await setState((draft) => {
      draft.list = []
    })
    resetPage()
  })

  const handleValueChange = (inputValue) => {
    setState((_val) => {
      _val.inputValue = inputValue
    })
  }

  const handleChangeTab = async (active) => {
    await setState((_val) => {
      _val.activeIndex = active
    })
  }

  const handleSearchFilter = async () => {
    await setState((draft) => {
      draft.list = []
    })
    resetPage()
  }

  const handleSubmitParams = async (params) => {
    console.log('==params==', params)
    await setState((_val) => {
      _val.filterParams = params
    })
  }

  useDepChange(() => {
    if (filterParams) {
      handleSearchFilter()
    }
  }, [filterParams])

  const handleAction = async (info, { type, label }) => {
    if (type === 'edit') {
      navigateToGoodForm(info.item_id)
    } else if (type === 'onsale' || type === 'instock') {
      await api.weapp.update_status({
        status: type,
        items: [{ goods_id: info.goods_id }]
      })
      handleSearchFilter()
    } else if (type === 'delete') {
      const { confirm } = await Taro.showModal({
        title: '确定删除？',
        content: ''
      })
      if (confirm) {
        await api.weapp.delete_good(info.goods_id)
        handleSearchFilter()
      }
    } else {
      showToast(`${label}，无法上下架！`)
    }
  }

  //是否是门店
  const isStore = activeIndex === 0

  console.log('==inputParams==', inputParams, inputValue)

  return (
    <View className='page-good-list' style={getThemeStyle()}>
      <View className='page-good-list-input'>
        <SelectInput
          inputParam={inputParams}
          inputValue={inputValue}
          pageType={PAGE_TYPE}
          paramChange={handleParamChange}
          valueChange={handleValueChange}
          onInputConfirm={handleSearchFilter}
        />
      </View>

      <FilterBlock title='商品筛选' pageType={PAGE_TYPE} onSubmitParams={handleSubmitParams} />

      <View className='page-good-list-tab'>
        <SpTab dataSource={TAB_LIST} onChange={handleChangeTab} />
      </View>
      <ScrollView
        className='page-good-list-list'
        scrollY
        scrollWithAnimation
        onScrollToLower={nextPageForce}
      >
        {isStore && list.length > 0 ? (
          list.map((goodInfo) => {
            let onSale = goodInfo.approve_status === 'onsale'
            let auditSuccess = goodInfo.audit_status === 'approved'
            let actions = []
            if (auditSuccess) {
              actions = onSale ? ACTION_LIST.concat(DIFF_SHELVES) : ACTION_LIST.concat(SHELVES)
            } else {
              actions =
                goodInfo.audit_status === 'processing'
                  ? ACTION_LIST.concat(AUDIT_PEROCESS)
                  : ACTION_LIST.concat(AUDIT_REJECTED)
            }
            return (
              <GoodItem info={goodInfo} key={goodInfo.goods_id}>
                {actions.map((item, index) => {
                  return (
                    <CommonButton
                      text={item.label}
                      size='small'
                      type={item.type === 'delete' ? 'danger' : 'primary'}
                      plain={item.plain}
                      key={index}
                      className='common-button'
                      onClick={() => handleAction(goodInfo, item)}
                    />
                  )
                })}
              </GoodItem>
            )
          })
        ) : (
          <SpNote img='empty.png'>暂无数据～</SpNote>
        )}
      </ScrollView>

      {isStore && (
        <View className='page-good-list-addbutton'>
          <View className='iconfont icon-tianjia'></View>
          <View className='text' onClick={() => navigateToGoodForm()}>
            添加商品
          </View>
        </View>
      )}

      <SpToast />
    </View>
  )
}

export default List
