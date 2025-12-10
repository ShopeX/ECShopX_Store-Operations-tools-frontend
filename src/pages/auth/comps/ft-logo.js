/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React from 'react'
import { View, Image } from '@tarojs/components'
import LOGO from '@/assets/imgs/shopex-logo.png'
import './ft-logo.scss'

function FtLogo() {
  return (
    <View className='ft-logo'>
      <Image className='logo' mode='widthFix' src={LOGO} />
    </View>
  )
}

export default FtLogo
