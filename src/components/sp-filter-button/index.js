/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View } from '@tarojs/components'
import Block from './block'
import './index.scss'

class SpFilterButton extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { filterItems = [], currentSelectValue, onClickBlock = () => {} } = this.props

    return (
      <View className='sp-filter-button'>
        {filterItems.map((item) => {
          return (
            <Block
              active={item.value === currentSelectValue}
              text={item.label}
              key={item.label}
              onClick={() => onClickBlock(item.value)}
            />
          )
        })}
      </View>
    )
  }
}

export default SpFilterButton
