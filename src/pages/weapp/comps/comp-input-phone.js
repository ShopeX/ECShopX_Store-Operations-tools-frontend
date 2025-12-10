/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import api from '@/api'
import './comp-input-phone.scss'
import classNames from 'classnames'

const initialValue = {
  error: false
}

const CompInputPhone = (props) => {
  const {
    name,
    type,
    placeholder,
    onChange = () => {},
    onFocus = () => {},
    onBlur = () => {},
    value,
    needValidate,
    ...restProps
  } = props

  const [state, setState] = useImmer(initialValue)

  const { error } = state

  const handleChange = async (val) => {
    onChange?.(val)
  }

  return (
    <View
      className={classNames('comp-input-phone', {
        'error': error
      })}
    >
      <AtInput
        clear
        name='mobile'
        maxLength={11}
        type='tel'
        placeholder='请输入您的手机号码'
        onChange={handleChange}
        value={value}
        {...restProps}
      />
    </View>
  )
}

CompInputPhone.options = {
  addGlobalClass: true
}

export default CompInputPhone
