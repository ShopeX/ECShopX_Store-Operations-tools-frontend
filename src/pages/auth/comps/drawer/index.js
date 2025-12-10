/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { ScrollButton } from '@/components/sp-page-components'
import { AtFloatLayout } from 'taro-ui'
import './index.scss'

const Drawer = (props) => {
  const { visible, onDrawerClose = () => {} } = props

  return (
    <AtFloatLayout isOpened={visible} onClose={onDrawerClose} className='agreement-drawer'>
      <View className='main'>
        <View className='body'>
          <View className='body-title'>
            <Text className='text'>欢迎使用商派云店</Text>
          </View>
          <ScrollView className='body-content'>
            <View className='body-content-title'>
              <Text className='text'>商派云店使用协议 & 商派云店隐私政策</Text>
            </View>
            <View className='body-content-text'>
              <Text className='text'>
                以下内容是《商派云店使用协议》及《商派云店隐私政策》，在你注册商派云店前请务必审慎阅读、充分理解协议中相关条款内容。《商派云店使用协议》包括接受条款；服务说明；你的注册义务；用户账号、密码及安全；用户个人信息保护；提供者之责任；服务变更、中断或终止；担保与保证；用户行为；知识产权；用户专属权利；国际使用之特别告知；未成年人使用条款；一般条款。《商派云店隐私政策》包括我们如何收集和使用你的个人信息；我们如何使用Cookie
                和同类技术；我们如何共享、转让、公开披露你的个人信息；我们如何保护你的个人信息；你的权利
                ；关于儿童的个人信息；你的个人信息如何在全球范围转移；本政策如何更新；如何联系我们。
                你一旦注册商派云店，即视为你已了解并同意《商派云店使用协议》及《商派云店隐私政策》的各项内容。
              </Text>
            </View>
            <View className='body-content-title'>
              <Text className='text'>商派云店使用协议</Text>
            </View>
            <View className='body-content-text'>
              <Text className='text'>2019年7月7日更新 查看历史版本</Text>
            </View>
            <View className='body-content-title'>
              <Text className='text'>
                请你务必审慎阅读、充分理解协议中相关条款内容，特别是粗体标注的内容。你一旦注册商派，即视为
              </Text>
            </View>
          </ScrollView>
        </View>
        <View className='bottom'>
          <ScrollButton />
        </View>
      </View>
    </AtFloatLayout>
  )
}

export default React.memo(Drawer)
