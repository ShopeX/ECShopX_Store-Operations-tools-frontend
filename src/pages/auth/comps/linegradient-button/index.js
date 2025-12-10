/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

const SpLinegradientButton = (props) => {
  const { title, onClick = () => {} } = props

  return (
    <View className='linegradient-button' onClick={onClick}>
      <Image src={require('@/assets/imgs/leftarrow.png')} className='img' />
      <Text className='title'>{title}</Text>
      <Image src={require('@/assets/imgs/rightarrow.png')} className='img' />
    </View>
  )
}

export default React.memo(SpLinegradientButton)
