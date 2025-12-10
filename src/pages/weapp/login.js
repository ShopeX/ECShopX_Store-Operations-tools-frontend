/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { CompOtherLogin, CompPasswordInput, CompInputPhone } from './comps'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import './login.scss'

const initInfo = {
  mobile: '',
  password: ''
}

const Login = () => {
  const [info, setInfo] = useImmer(initInfo)

  const handleInputChange = (name) => (val, error) => {
    console.log('===handleInputChange==', val, name)
    setInfo((_info) => {
      _info[name] = val
    })
  }

  return (
    <View className={classNames('page-auth-login')}>
      <View className='auth-hd'>
        <View className='title'>欢迎登录</View>
        <View className='desc'>使用已注册的手机号登录</View>
      </View>

      <View className='auth-info'>中国大陆 +86</View>

      <View className='auth-line'></View>

      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field noborder'>
            <CompInputPhone onChange={handleInputChange('mobile')} value={info.mobile} />
          </View>
          <View className='form-field'>
            <View className='input-field'>
              <CompPasswordInput onChange={handleInputChange('password')} />
            </View>
          </View>
          <View className='form-submit'>
            <AtButton circle type='primary' className='login-button'>
              登 录
            </AtButton>
          </View>
        </AtForm>
      </View>
    </View>
  )
}

export default Login
