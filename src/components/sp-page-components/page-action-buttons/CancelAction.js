/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'
import { ORDER_LIST_CANCEL_REASON } from '@/consts'
import { AtTextarea } from 'taro-ui'
import { SpPicker } from '@/components'
import { requestCallback } from '@/utils'
import { ActionSheet } from '@/components/sp-page-components'
import api from '@/api'
import './index.scss'

export default class CancelAction extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      //picker的标题
      pickerTitle: '取消订单',
      //取消订单的数据列
      cancelData: ORDER_LIST_CANCEL_REASON,
      note: ''
    }
  }

  handlePickerConfirm = (selectIndex) => {
    const { cancelData } = this.state
    const { onSelectOther = () => {}, onRefresh, orderInfo, onCancel } = this.props
    let cancelKeys = Object.keys(cancelData)
    let selectKey = cancelKeys[selectIndex]
    //如果是取消原因
    if (selectKey == 12) {
      onSelectOther()
    } else {
      requestCallback(
        async () => {
          const data = await api.order.cancel({
            order_id: orderInfo.order_id,
            cancel_reason: selectKey
          })
          return data
        },
        '取消订单成功',
        () => {
          onCancel && onCancel()
          onRefresh?.()
        }
      )
    }
  }

  handleChangeNote = (value) => {
    this.setState({
      note: value
    })
  }

  handleConfirm = () => {
    const { orderInfo, onCancel, onRefresh } = this.props
    requestCallback(
      async () => {
        const data = await api.order.cancel({
          order_id: orderInfo.order_id,
          cancel_reason: 12,
          other_reason: this.state.note
        })
        return data
      },
      '修改备注成功',
      () => {
        this.setState({
          note: ''
        })
        onCancel && onCancel()
        onRefresh?.()
      }
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reasonVisible !== this.props.reasonVisible && this.props.reasonVisible) {
      // if (isIos()) {
      //   document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
      // } else {
      setTimeout(() => {
        document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
      }, 300)
      // }
    }
  }

  render() {
    const { visible, onCancel = () => {}, reasonVisible } = this.props

    const { pickerTitle, cancelData, note } = this.state

    return (
      <View className='cancel-action'>
        <SpPicker
          visible={visible}
          confirmType='danger'
          title={pickerTitle}
          columns={Object.values(cancelData)}
          // onChange={this.handlePickerChange}
          onConfirm={this.handlePickerConfirm}
          onCancel={onCancel}
          onClose={onCancel}
        />

        <ActionSheet
          visible={reasonVisible}
          onClose={onCancel}
          onCancel={onCancel}
          onConfirm={this.handleConfirm}
          className='note'
          title='其他原因备注'
        >
          <View className='content' id='content'>
            <AtTextarea
              count
              value={note}
              onChange={this.handleChangeNote}
              maxLength={150}
              placeholder='请输入你的取消原因...'
            />
          </View>
        </ActionSheet>
      </View>
    )
  }
}
