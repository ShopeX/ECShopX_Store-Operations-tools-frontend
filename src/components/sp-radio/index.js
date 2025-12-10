/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.scss'
import { AtTag } from 'taro-ui'

const duigou = require('@/assets/imgs/zyk-duigou.png')
const defaultshop = require('@/assets/imgs/defaultshop.png')

export default class index extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { SpRadioData, isActive, activeHandle } = this.props
    console.log(this.props)
    return (
      SpRadioData && (
        <View className='cpn-radio_warp'>
          {SpRadioData.map((item, index) => {
            return (
              <View
                key={item.distributor_id}
                className='cpn-radio'
                onClick={() => activeHandle(item)}
              >
                <View className='radio'>
                  <View className='part1'>
                    <View className='logo'>
                      <Image src={item.logo || defaultshop}></Image>
                    </View>
                    <View className='content'>
                      <View className='title'>{item.name}</View>
                      {item.is_center && (
                        <View className='tag'>
                          <AtTag size='small' type='primary'>
                            总部
                          </AtTag>
                        </View>
                      )}
                    </View>
                  </View>
                  {item.distributor_id === isActive && (
                    <View className='active'>
                      <Image src={duigou}></Image>
                    </View>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      )
    )
  }
}
