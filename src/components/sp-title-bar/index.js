/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { AtNavBar } from 'taro-ui'

import { View } from '@tarojs/components'
import './index.scss'

class Index extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    const { leftText, title, rightFirstIconType, rightSecondIconType } = this.props.SpTitleBarData
    return (
      <View className='cpn-spTitlebar'>
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          onClickRgIconNd={this.handleClick}
          onClickLeftIcon={this.handleClick}
          color='#000'
          title={title}
          leftText={leftText || null}
          rightFirstIconType={rightFirstIconType || null}
          rightSecondIconType={rightSecondIconType || null}
        />
      </View>
    )
  }
}
export default Index
