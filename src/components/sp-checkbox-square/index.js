/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { classNames } from '@/utils'

/**
 * items:[{value:'',label:''}]
 */

class SpCheckboxSquare extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      active: ''
    }
  }

  render() {
    const { items } = props

    return (
      <View className={classNames('sp-checkbox-square')}>
        {items.map((item) => (
          <View className='item'>{item.label}</View>
        ))}
      </View>
    )
  }
}

export default SpCheckboxSquare
