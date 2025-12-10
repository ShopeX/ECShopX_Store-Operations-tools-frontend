/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import Taro from '@tarojs/taro'
import './index.scss'

/**
 *
 */
class SpIconFooter extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderIcon = () => {
    let iconClassName = ''
    const { pageType, type } = this.props
    if (type === 'remark') {
      iconClassName = 'icon-bianji1'
    }

    return <View className={classNames('iconfont', iconClassName, 'icon')}></View>
  }

  renderText = () => {
    let text = ''
    const { pageType, type } = this.props
    if (type === 'remark') {
      text = '修改备注'
    }
    return <View className='text'>{text}</View>
  }

  render() {
    const { className, onContentClick = () => {} } = this.props

    return (
      <View className={classNames('sp-component-icon-footer', className)}>
        <View className='sp-component-icon-footer_content' onClick={onContentClick}>
          {this.renderIcon()}
          {this.renderText()}
        </View>
      </View>
    )
  }
}

export default SpIconFooter
