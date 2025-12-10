/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { View } from '@tarojs/components'
import React, { PureComponent } from 'react'
import { AtFloatLayout, AtTextarea } from 'taro-ui'
import { classNames } from '@/utils'
import './index.scss'

class SpDrawer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  handleChange = (value) => {
    this.setState({
      content: value
    })
  }

  handleConfirm = () => {
    const { onConfirm = () => {} } = this.props
    onConfirm(this.state.content)
    this.setState({
      content: ''
    })
  }

  render() {
    const {
      visible,
      onClose = () => {},
      title = '操作弹框',
      onCancelText = '取消',
      onConfirmText = '确定',
      onCancel = () => {},
      className,
      placeholder = '请输入你的备注...',
      type
    } = this.props

    const { content } = this.state

    return (
      <AtFloatLayout
        isOpened={visible}
        onClose={onClose}
        className={classNames('sp-component-drawer', className)}
      >
        <View className='header'>
          <View className='left' onClick={onCancel}>
            {onCancelText}
          </View>
          <View className='center'>{title}</View>
          <View className='right' onClick={this.handleConfirm}>
            {onConfirmText}
          </View>
        </View>
        <View className='content' id='content'>
          {type === 'number' ? (
            <AtInput />
          ) : (
            <AtTextarea
              count
              value={content}
              onChange={this.handleChange}
              maxLength={150}
              autoFocus
              placeholder={placeholder}
            />
          )}
        </View>
      </AtFloatLayout>
    )
  }
}

export default SpDrawer
