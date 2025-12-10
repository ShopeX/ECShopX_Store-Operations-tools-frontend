/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect, useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { requestCallback } from '@/utils'
import { DeliveryForm } from '@/components/sp-page-components'
import './index.scss'

const initState = {}
function TimeLineItem(props) {
  const [state, setState] = useImmer(initState)

  const {} = state

  const { item, children } = props

  const handlePreviewPics = (idx) => {
    Taro.previewImage({
      urls: item.pics,
      current: item.pics[idx]
    })
  }

  console.log(props)
  return (
    <View className='time-line-item'>
      <View className='left-dot'></View>
      <View className='content'>
        <View className='content-title'>{item.title}</View>
        {item.delivery_remark && (
          <View className='content-remark'>订单备注：{item.delivery_remark}</View>
        )}
        {item.pics.length > 0 && (
          <View>
            照片上传：
            <View className='content-pic'>
              {item.pics.map((item, idx) => (
                <Image
                  src={item}
                  className='content-pic-item'
                  key={idx}
                  onClick={() => handlePreviewPics(idx)}
                ></Image>
              ))}
            </View>
          </View>
        )}
        {/* {children} */}
      </View>
    </View>
  )
}

export default TimeLineItem
