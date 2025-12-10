/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { PureComponent } from 'react'
import './index.scss'
import { View, Text } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import { requestCallback, classNames } from '@/utils'
import S from '@/spx'
import { ActionSheet } from '@/components/sp-page-components'
import api from '@/api'

export default class SpRemarkDrawer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      noteContent: '',
      maxLength: 150
    }
  }

  handleChangeNote = (value) => {
    this.setState({
      noteContent: value
    })
  }

  handleClose = (e) => {
    const { onClose } = this.props
    this.setState({
      noteContent: ''
    })
    onClose && onClose()
  }

  //验证数量
  validateNum = () => {
    return this.state.noteContent.length > this.state.maxLength
  }

  async handleConfirm(e) {
    const { onClose, orderInfo, onRefresh, pageType, afterSalesInfo } = this.props
    const { noteContent } = this.state

    if (this.validateNum()) {
      S.toast('字数请不要超过150字！')
      return
    }

    requestCallback(
      async () => {
        let data
        if (pageType === 'orderList' || pageType === 'orderDetail') {
          data = await api.order.remarks({
            orderId: orderInfo.order_id,
            remark: noteContent,
            is_distribution: '1'
          })
        } else if (pageType === 'afterSalesList' || pageType === 'afterSalesDetail') {
          data = await api.afterSales.remark({
            aftersales_bn: afterSalesInfo?.aftersales_bn || orderInfo.aftersales_bn,
            remark: noteContent
          })
        }
        return data
      },
      '修改备注成功',
      () => {
        this.setState({
          noteContent: ''
        })
        onClose && onClose()
        onRefresh?.()
      }
    )
  }

  setDefaultNote = () => {
    const { pageType } = this.props
    if (pageType === 'orderList' || pageType === 'orderDetail' || pageType === 'afterSalesDetail') {
      this.setState({
        noteContent: this.props.orderInfo.distributor_remark
      })
    } else if (pageType === 'afterSalesList') {
      this.setState({
        noteContent: this.props.afterSalesInfo.distributor_remark
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      // if (isIos()) {
      //   document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
      // } else {
      setTimeout(() => {
        console.log('this.noteRef', this.noteRef)
        document.getElementById('content').getElementsByClassName('taro-textarea')[0].focus()
      }, 300)
      // }

      this.setDefaultNote()
    }
  }

  render() {
    const { visible, onClose } = this.props

    const { noteContent, maxLength } = this.state

    return (
      <ActionSheet
        visible={visible}
        onClose={onClose}
        onCancel={this.handleClose}
        onConfirm={this.handleConfirm.bind(this)}
        className={classNames('sp-component-remark-drawer')}
        title='订单备注'
      >
        <View className='content' id='content'>
          <AtTextarea
            count={false}
            value={noteContent}
            onChange={this.handleChangeNote}
            placeholder='请输入你的备注...'
            id='textarea'
          />

          <View className={classNames('count', { ['error']: this.validateNum() })}>
            <Text>{noteContent.length}</Text>
            <Text>/</Text>
            <Text>{maxLength}</Text>
          </View>
        </View>
      </ActionSheet>
    )
  }
}
