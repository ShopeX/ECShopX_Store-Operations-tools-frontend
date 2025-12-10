/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'

export default class RefuseTextarea extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      noteContent: ''
    }
  }

  handleChangeNote = (value) => {
    const { onChange = () => {} } = this.props

    this.setState({
      noteContent: value
    })
    onChange(value)
  }

  render() {
    const { noteContent } = this.state

    return (
      <View className='page-order-deal-comps-refusetextarea'>
        <AtTextarea
          count
          value={noteContent}
          onChange={this.handleChangeNote}
          maxLength={150}
          placeholder='请输入具体的原因...'
        />
      </View>
    )
  }
}
