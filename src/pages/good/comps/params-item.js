/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { SpTab, SpPicker, SpSpecSelector } from '@/components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import FormItem from './form-item'

import './params-item.scss'

const initState = {
  pickVisible: false,
  pickList: [],
  activeIndex: 0
}

const ParamsItem = (props) => {
  const { paramsData, onChange = () => {} } = props

  //选择的规格

  const [state, setState] = useImmer(initState)

  const { pickVisible, pickList, activeIndex } = state

  useEffect(() => {}, [])

  const handleClickFormItem = (index) => (value) => {
    // console.log(123,index,paramsData[index])
    setState((draft) => {
      draft.pickVisible = true
      draft.pickList = paramsData[index].children
      draft.activeIndex = index
    })
  }

  const handleChangeForm = (key) => async (item) => {
    const nparamsData = JSON.parse(JSON.stringify(paramsData))
    nparamsData[activeIndex].attribute_value_id = pickList[item].value
    nparamsData[activeIndex].attribute_value_name = pickList[item].label

    await setState((draft) => {
      draft.pickVisible = false
    })
    onChange([...nparamsData])
  }

  return (
    <View className='params-item'>
      <View className='title'>商品参数</View>
      <View className='top-block'>
        {paramsData.map((item, index) => {
          return (
            <FormItem
              key={index}
              label={item.label}
              mode='selector'
              placeholder='请选择'
              onClick={handleClickFormItem(index)}
              value={item.attribute_value_name}
            />
          )
        })}
      </View>
      <SpPicker
        visible={pickVisible}
        title='选择品牌'
        columns={pickList.map((item) => item.label)}
        onCancel={() =>
          setState((_val) => {
            _val.pickVisible = false
          })
        }
        onClose={() =>
          setState((_val) => {
            _val.pickVisible = false
          })
        }
        onConfirm={handleChangeForm()}
      />
    </View>
  )
}

export default ParamsItem
