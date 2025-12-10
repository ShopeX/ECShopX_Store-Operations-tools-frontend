/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { useDepChange } from '@/hooks'
import './index.scss'

const initialState = {
  activeIndex: 0
}

const SpTab = (props) => {
  const { dataSource: tabList, onChange = () => {} } = props

  const handleClickTab = (activeIndex) => () => {
    setState((_state) => {
      _state.activeIndex = activeIndex
    })
  }

  const [state, setState] = useImmer(initialState)

  const { activeIndex } = state

  useDepChange(() => {
    onChange(activeIndex)
  }, [activeIndex])

  return (
    <View className='sp-tab'>
      {tabList.map((item, index) => {
        return (
          <View
            className={classNames('sp-tab-item', {
              'active': activeIndex === index
            })}
            key={item.value}
            onClick={handleClickTab(index)}
          >
            <View className='sp-tab-item_label'>{item.label}</View>
            <View className='sp-tab-item_active' />
          </View>
        )
      })}
    </View>
  )
}

export default SpTab
