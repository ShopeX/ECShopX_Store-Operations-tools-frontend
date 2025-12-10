/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React from 'react'
import { View } from '@tarojs/components'
import classNames from '@/utils/classNames'

import './index.scss'

const SpBackToTop = (props) => {
  const { show, onClick, bottom } = props

  return (
    <View
      className={classNames('sp-back-to-top', { 'is-show': show })}
      style={`${bottom ? `bottom: ${Taro.pxTransform(bottom)}` : ''}`}
      onClick={onClick}
    >
      <View className='icon-arrow-up'></View>
    </View>
  )
}

export default React.memo(SpBackToTop)
