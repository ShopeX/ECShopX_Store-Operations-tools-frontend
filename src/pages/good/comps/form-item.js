/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import { SpTab, SpGoodPrice } from '@/components'
import { SelectInput, Tabbar, PageActionButtons } from '@/components/sp-page-components'
import { getThemeStyle, classNames, isUndefined } from '@/utils'
import { useImmer } from 'use-immer'
import { AtInput, AtSwitch, AtInputNumber } from 'taro-ui'
import './form-item.scss'

const initState = {
  value: ''
}

const FormItem = (props) => {
  const {
    label,
    required = false,
    mode = 'input',
    placeholder,
    onClick = () => {},
    value: valueProp,
    onChange: onChangeProp = () => {},
    className,
    type = 'text',
    editable
  } = props

  const isSelector = mode == 'selector'

  const isInput = mode === 'input'

  const isSwitch = mode === 'switch'

  const [state, setState] = useImmer(initState)

  const { value } = state

  useEffect(() => {
    if (valueProp) {
      setState((_val) => {
        _val.value = valueProp
      })
    }
    if (!valueProp && isSwitch) {
      setState((_val) => {
        _val.value = valueProp
      })
    }
  }, [valueProp])

  return (
    <View className={classNames('form-item', className)}>
      {required && <View className='form-item-required'>*</View>}
      <View className='form-item-label'>{label}</View>
      <View className='form-item-main' onClick={onClick}>
        <AtInput
          editable={isUndefined(editable) ? isInput : editable}
          className='input'
          placeholder={placeholder}
          value={isSwitch ? '' : value}
          onChange={onChangeProp}
          type={type}
        />

        <View
          className={classNames('form-item-main-action', {
            hasArrow: isSelector
          })}
        >
          <View className='iconfont icon-jiantou'></View>
          {isSwitch && <AtSwitch border={false} checked={!!value} onChange={onChangeProp} />}
        </View>
      </View>
    </View>
  )
}

export default FormItem
