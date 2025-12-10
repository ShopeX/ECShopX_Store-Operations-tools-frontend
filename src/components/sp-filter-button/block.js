/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

const selected_img = require('../../assets/imgs/selected.png')

export default class Block extends PureComponent {
  constructor(props) {
    super(props)
  }

  computedRow = () => {
    const { text } = this.props

    if (!text || text.length < 5) {
      return 1
    }

    if (text.length >= 5 && text.length <= 9) {
      return 2
    }

    if (text.length >= 10) {
      return 3
    }
  }

  render() {
    const { text, active, onClick = () => {} } = this.props

    return (
      <View
        className={classNames('block', {
          [`col-${this.computedRow()}`]: this.computedRow(),
          [`active`]: active
        })}
        onClick={onClick}
      >
        <Text className='text'>{text}</Text>
        <Image src={selected_img} className='selected_img' />
      </View>
    )
  }
}
