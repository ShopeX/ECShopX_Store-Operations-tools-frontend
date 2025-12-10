/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { classNames } from '@/utils'
import { View, Input } from '@tarojs/components'
import './index.scss'

export default class SpFormItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      label = '这是一个label',
      value = '',
      onClickValue = () => {},
      onClickTip = () => {},
      placeholder,
      error,
      children,
      wrap,
      className,
      tip,
      labelbold
    } = this.props

    return (
      <View
        className={classNames('sp-component-form-item', className, {
          ['wrap']: wrap,
          ['labelbold']: labelbold
        })}
      >
        <View className='label'>{label}</View>
        {wrap && tip && (
          <View className='tip' onClick={onClickTip}>
            {tip}
          </View>
        )}
        <View
          className={classNames('placeholder', { ['has-value']: value, ['error']: error })}
          onClick={onClickValue}
        >
          {children ? children : value ? value : placeholder}
        </View>
      </View>
    )
  }
}
