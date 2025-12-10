/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Input, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class SpInputNumber extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  handleInput = (event) => {
    const { onChange = () => {} } = this.props
    const {
      detail: { value }
    } = event
    onChange(value)
  }

  handleFocus = () => {
    this.setState({
      active: true
    })
  }

  handleBlur = () => {
    const { clear, value } = this.props
    const self = this
    if (clear && value) {
      setTimeout(() => {
        self.setState({
          active: false
        })
      }, 200)
    } else {
      self.setState({
        active: false
      })
    }
  }

  clearValue = () => {
    const { onChange = () => {} } = this.props
    onChange(0)
  }

  render() {
    const { placeholder, clear, value, error, disabled } = this.props

    const { active } = this.state

    return (
      <View
        className={classNames('sp-input-number', {
          ['active']: active,
          ['error']: error
        })}
      >
        <Input
          clear
          type='number'
          className='custominput'
          value={value}
          onInput={this.handleInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          disabled={disabled}
        />
        {placeholder && !value && value != 0 && <View className='placeholder'>{placeholder}</View>}
        {(clear && !!value && active) ||
          (!!value && error && (
            <View className='clear' onClick={this.clearValue}>
              <Text className='iconfont icon-shanchu-01'></Text>
            </View>
          ))}
        {error && <View className='tips'>{error}</View>}
      </View>
    )
  }
}
