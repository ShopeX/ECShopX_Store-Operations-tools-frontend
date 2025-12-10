/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { useEffect, useState } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { SpBackToTop, SpToast } from '@/components'
import Drawer from '../comps/drawer'
import LinegradientButton from '../comps/linegradient-button'
import { useBackToTop } from '@/hooks'
import { getThemeStyle } from '@/utils'
import api from '@/api'
import './index.scss'

const AgreeMent = () => {
  const [visible, setVisible] = useState(false)

  const { showBackToTop, scrollBackToTop } = useBackToTop()

  const handleShow = () => {
    setVisible(true)
  }

  const handleDrawerClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    api.operator.getProtocol()
  }, [])

  return (
    <View className='page-auth-agreement' style={getThemeStyle()}>
      <View className='page-auth-agreement-header-logo'>
        <Image src={require('@/assets/imgs/logotitle.png')} className='img' />
      </View>
      <View className='page-auth-agreement-header-title'>
        <Text className='text'>数据透视·智慧赋能·全渠道管理</Text>
      </View>
      <View className='page-auth-agreement-body-logo'>
        <Image src={require('@/assets/imgs/logo1.png')} className='img' />
      </View>
      <View className='page-auth-agreement-body-button'>
        <LinegradientButton title='开始我的数字化经营' onClick={handleShow} />
      </View>

      {/* <SpShopxLogo /> */}

      {/* 用户协议 */}
      <Drawer visible={visible} onDrawerClose={handleDrawerClose} />

      {/* 返回顶部 */}
      <SpBackToTop show={showBackToTop} onClick={scrollBackToTop} />

      <SpToast />
    </View>
  )
}

export default AgreeMent
