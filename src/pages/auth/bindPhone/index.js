/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpTimer, SpToast } from '@/components'
import { getThemeStyle, validate, getCurrentRoute, requestCallback } from '@/utils'
import LOGO from '@/assets/imgs/shopex-logo.png'
import api from '@/api'
import S from '@/spx'
import './index.scss'

export default class Login extends Component {
  state = {
    info: {
      mobile: '',
      vcode: '',
      type: 'login'
    },
    loginType: 0, // 0:验证码登录；1:密码登录
    showLogo: true
  }

  componentDidMount() {}

  async handleSubmit() {
    const { mobile, vcode } = this.state.info
    const { work_userid, check_token } = getCurrentRoute().params
    if (!validate.isMobileNum(mobile)) {
      S.toast('请输入正确的手机号')
      return
    }
    if (validate.isRequired(vcode)) {
      S.toast('请输入验证码')
      return
    }

    requestCallback(
      async () => {
        const data = await api.operator.bindPhone({
          work_userid,
          check_token,
          mobile,
          vcode
        })
        return data
      },
      '',
      async ({ token }) => {
        if (token) {
          S.setAuthToken(token)
          const userInfo = await api.operator.getUserInfo()
          S.set('user_info', userInfo, true)
          Taro.redirectTo({ url: `/pages/planSelection/index` })
        } else {
          S.toast('登录失败')
        }
      }
    )
  }

  async handleTimerStart(resolve) {
    const { mobile, type } = this.state.info
    if (!validate.isMobileNum(mobile)) {
      S.toast('请输入正确的手机号')
      return
    }
    await api.operator.sendCode({
      mobile,
      type
    })
    S.toast('验证码已发送')
    resolve()
  }

  handleTimerStop() {}

  handleInputChange(name, val) {
    const { info } = this.state
    info[name] = val
    this.setState({
      info
    })
  }

  handleFocus = () => {
    console.log('handleFocus')
    this.setState({
      showLogo: false
    })
  }

  handleBlur = () => {
    console.log('handleBlur')
    this.setState({
      showLogo: true
    })
  }

  render() {
    const { info, showLogo } = this.state
    return (
      <View className='page-auth-bindphone' style={getThemeStyle()}>
        {/* <View className='page-auth-wrapper'> */}
        <View className='auth-hd'>
          <View className='title'>欢迎登录商派</View>
          <View className='desc'>请输入云店后台所关联手机号</View>
        </View>
        <View className='auth-bd'>
          <View className='form-title'>中国大陆 +86</View>
          <AtForm className='form'>
            <View className='form-field'>
              <AtInput
                clear
                name='mobile'
                maxLength={11}
                type='tel'
                value={info.mobile}
                placeholder='请输入您的手机号码'
                onChange={this.handleInputChange.bind(this, 'mobile')}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
            </View>
            <View className='form-field'>
              <View className='input-field'>
                <AtInput
                  clear
                  name='vcode'
                  value={info.vcode}
                  placeholder='请输入验证码'
                  onChange={this.handleInputChange.bind(this, 'vcode')}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
              </View>
              <View className='btn-field'>
                <SpTimer onStart={this.handleTimerStart.bind(this)} onStop={this.handleTimerStop} />
              </View>
            </View>
            {/* <View className='btn-text'>密码登录</View> */}
            <View className='form-submit'>
              <AtButton
                circle
                className='btn-submit'
                type='primary'
                onClick={this.handleSubmit.bind(this)}
              >
                登录
              </AtButton>
            </View>
          </AtForm>
        </View>
        {/* </View> */}
        <SpToast />
        {showLogo && (
          <View className='auth-ft'>
            <Image className='logo' mode='widthFix' src={LOGO} />
          </View>
        )}
      </View>
    )
  }
}
