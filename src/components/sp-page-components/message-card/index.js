/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { classNames } from '@/utils'
import './index.scss'

class MessageCard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      active: 0
    }
  }

  handleChange = (active) => (e) => {
    this.setState({
      active
    })
  }

  handleCallPhone = () => {
    const { leftPhone, rightPhone } = this.props
    const phone = this.state.active === 0 ? leftPhone : rightPhone
    if (phone && phone.indexOf('*') == -1) {
      Taro.makePhoneCall({
        phoneNumber: phone
      })
    }
  }

  checkPhone = (info) => {
    let flag
    return (flag = info.length && info[0].value.indexOf('*') != -1 ? true : false)
  }

  render() {
    const {
      className,
      leftTitle,
      rightTitle = '买家信息',
      leftContent = [],
      rightContent = [],
      user_delete //  会员注销
    } = this.props

    const { active } = this.state

    return (
      <View className={classNames('sp-page-message-card', className)}>
        <View className='header'>
          <View
            className={classNames('item left', {
              ['active']: active === 0
            })}
            onClick={this.handleChange(0)}
          >
            <Text>{leftTitle}</Text>
          </View>
          <View
            className={classNames('item right', {
              ['active']: active === 1
            })}
            onClick={this.handleChange(1)}
          >
            <Text>{rightTitle}</Text>
          </View>
          <View
            className={classNames('underline', {
              activeLeft: active === 0,
              activeRight: active === 1
            })}
          ></View>
        </View>
        {active === 0 && (
          <View className='content'>
            {leftContent.map((left) => (
              <View className='content-item' key={left.label}>
                <View className='title'>{left.label}</View>
                <View className='value'>{left.value}</View>
              </View>
            ))}
          </View>
        )}
        {active === 1 && (
          <View className='content'>
            {rightContent.map((left) => (
              <View className='content-item' key={left.label}>
                <View className='title'>{left.label}</View>
                <View className='value'>{left.value}</View>
              </View>
            ))}
          </View>
        )}
        <View className='footer'>
          <View
            className={classNames('content', {
              disabled: user_delete || this.checkPhone(leftContent)
            })}
            onClick={this.handleCallPhone}
          >
            <Text
              className={classNames('iconfont', 'icon-shoujihao', {
                disabled: user_delete || this.checkPhone(leftContent)
              })}
            ></Text>
            <Text
              className={classNames('text', {
                disabled: user_delete || this.checkPhone(leftContent)
              })}
            >
              拨打电话
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
export default MessageCard
