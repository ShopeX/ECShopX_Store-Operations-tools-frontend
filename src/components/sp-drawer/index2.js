/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { PureComponent } from 'react'
import './index.scss'
import { View, Textarea } from '@tarojs/components'
import { AtInput, AtTextarea } from 'taro-ui'
import { classNames } from '@/utils'
import { ActionSheet } from '@/components/sp-page-components'
import api from '@/api'

export default class NoteDrawer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
  }

  handleChangeNote = (value) => {
    this.setState({
      content: value
    })
  }

  handleClose = (e) => {
    const { onClose } = this.props
    this.setState({
      content: ''
    })
    onClose && onClose()
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      if (prevProps.type === 'number') {
        setTimeout(() => {
          document.getElementById('content').getElementsByClassName('weui-input')[0].focus()
        }, 300)
      } else {
        setTimeout(() => {
          document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
        }, 300)
      }
    }
  }

  handleFocus = (e) => {
    console.log('handleFocus', e)
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
      title,
      placeholder,
      onCancel = () => {},
      className,
      type
    } = this.props

    const { content } = this.state

    //是否是数字型输入框
    const isNumberInput = type === 'number'

    return (
      <ActionSheet
        visible={visible}
        onClose={onClose}
        onCancel={onCancel}
        onConfirm={this.handleConfirm}
        className={classNames('sp-component-drawer', className, {
          ['input-number']: isNumberInput
        })}
        title={title}
      >
        <View className='content' id='content'>
          {/* <Textarea ref={(ref) => (this.noteRef = ref)} /> */}
          {isNumberInput ? (
            <AtInput
              className='custom-input'
              value={content}
              onChange={this.handleChangeNote}
              placeholder={placeholder}
            />
          ) : (
            <AtTextarea
              count
              value={content}
              onChange={this.handleChangeNote}
              maxLength={150}
              placeholder={placeholder}
              onFocus={this.handleFocus}
              ref={(ref) => (this.noteRef = ref)}
              id='textarea'
            />
          )}
        </View>
      </ActionSheet>
    )
  }
}
