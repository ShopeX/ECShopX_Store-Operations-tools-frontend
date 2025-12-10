/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import { ActionSheet } from '@/components/sp-page-components'
import { SpLoading } from '@/components'
import { View, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames, createChainedFunction } from '@/utils'
import { flattenArray, findById } from './util'
import './index.scss'

const initState = {
  //所选择过的区域{key,label}
  selectArea: [],
  //代表主类目的下标
  mainActiveIndex: -1
}

const SpMultilevelPicker = (props) => {
  const {
    visible,
    onClose: onCloseProp = () => {},
    onCancel = () => {},
    title,
    dataSource = [],
    onChange: onChangeProp = () => {}
  } = props

  const [state, setState] = useImmer(initState)

  const { selectArea, mainActiveIndex } = state

  const selectAreaLength = selectArea.length

  const handleClickScrollItem = (areaItem) => {
    let currentSelectArea = [...selectArea]

    if (!selectAreaLength.length) {
      currentSelectArea.push(areaItem)
    }

    setState((_state) => {
      _state.selectArea = currentSelectArea
      _state.mainActiveIndex = -1
    })
  }

  const handleClickHeader = (index) => {
    let currentSelectArea = [...selectArea]
    currentSelectArea = currentSelectArea.slice(0, index + 1)
    setState((_val) => {
      _val.mainActiveIndex = index
      _val.selectArea = currentSelectArea
    })
  }

  //点击的那一个
  const currentClickItem = selectArea[selectAreaLength - 1]

  //根据selectArea哪一个进行渲染列表
  const currentListByItem = selectAreaLength === 3 ? selectArea[1] : currentClickItem

  const currentList = findById(dataSource, currentListByItem?.id) || []

  const onClose = createChainedFunction(onCloseProp, () => {
    setState((_val) => {
      _val.selectArea = []
    })
  })

  useEffect(() => {
    if (selectAreaLength === 3) {
      onChangeProp(selectArea[2], selectArea)
      setState((_val) => {
        _val.selectArea = []
      })
    }
  }, [selectArea])

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      onCancel={onCancel}
      title={title}
      className='sp-multilevel-picker'
      onConfirmText=''
      onCancelText=''
    >
      {dataSource.length > 0 ? (
        <View>
          <View className={classNames('sp-multilevel-picker-header', 'underline')}>
            {selectArea.map((selectAreaItem, selectIndex) => (
              <View
                key={selectIndex}
                className={classNames('title', {
                  'active': selectIndex === mainActiveIndex
                })}
                onClick={() => handleClickHeader(selectIndex)}
              >
                <View className='title-label'>{selectAreaItem.label}</View>
              </View>
            ))}
            {selectAreaLength !== 3 && (
              <View className='title primary'>
                <View className='title-label'>请选择</View>
              </View>
            )}
          </View>
          <ScrollView scrollY className={classNames('sp-multilevel-picker-scrolllist')}>
            {currentList.length > 0 ? (
              currentList.map((item, index) => (
                <View
                  key={index}
                  className={classNames('sp-multilevel-picker-scrolllist-item', {
                    'active': currentClickItem?.id === item.id
                  })}
                  onClick={() => handleClickScrollItem(item)}
                >
                  <View className='label'>{item.label}</View>
                </View>
              ))
            ) : (
              <View>暂无数据～</View>
            )}
          </ScrollView>
        </View>
      ) : (
        <SpLoading />
      )}
    </ActionSheet>
  )
}

export default SpMultilevelPicker
