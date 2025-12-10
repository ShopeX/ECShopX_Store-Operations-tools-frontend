/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'

import { View, Image } from '@tarojs/components'
import './index.scss'

class Index extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    const { imgurl, bgColor, title, subtitle } = this.props.SpMessageData
    const { date, messageNum, onclickHander } = this.props
    return (
      <View className='com-message' onClick={onclickHander}>
        <View className='left'>
          <View className='imgBox' style={bgColor}>
            <Image className='img' src={imgurl}></Image>
          </View>
          <View className='info'>
            <View className='title'>{title}</View>
            <View className='subtitle'>{subtitle}</View>
          </View>
        </View>
        <View className='right'>
          <View className='date'>{date}</View>
          {messageNum > 0 && (
            <View className='messageNum'>{messageNum > 99 ? '99+' : messageNum}</View>
          )}
        </View>
      </View>
    )
  }
}
export default Index
