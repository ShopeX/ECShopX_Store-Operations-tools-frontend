/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, ScrollView } from '@tarojs/components'
import api from '@/api'
import { showToast, isIos, qwsdk } from '@/utils'
import S from '@/spx'
import FtLogo from '../comps/ft-logo'
import { SpToast } from '@/components'
import './index.scss'

export default class Index extends Component {
  state = {
    ...this.state,
    OAuthUrl: ''
  }

  async componentDidMount() {
    const { href } = window.location
    const that = this
    const { params } = getCurrentInstance().router
    console.log('auth:params1', params)
    if (params.isWebView) {
      qwsdk.set('_isWebView', true)
      if (!isIos()) {
        qwsdk.set('_url', location.href.split('#')[0])
        qwsdk.setImage('授权页')
      }
    }
    that.init(params)
  }
  init({ code, company_id, token, entryCode }) {
    if (token) {
      this.getUserInfo(token)
    } else {
      if (code) {
        this.workwechatOauthLogin(code, company_id)
      } else {
        this.getAuthorizeUrl()
      }
    }
  }

  async getUserInfo(token) {
    S.setAuthToken(token)
    const userInfo = await api.operator.getUserInfo()
    S.set('user_info', userInfo, true)
    Taro.redirectTo({ url: `/pages/planSelection/index` })
  }

  async workwechatOauthLogin(code, company_id) {
    const { status, work_userid, check_token, token } = await api.auth.workwechatOauthLogin({
      company_id,
      code
    })
    if (status == 'success') {
      this.getUserInfo(token)
      // S.setAuthToken(token)
      // const userInfo = await api.operator.getUserInfo()

      // S.set('user_info', userInfo, true)
      // Taro.redirectTo({ url: `/pages/planSelection/index` })
    } else if (status == 'unbound') {
      Taro.redirectTo({
        url: `/pages/auth/bindPhone?work_userid=${work_userid}&check_token=${check_token}`
      })
    }
  }

  async getAuthorizeUrl() {
    const { url } = await api.auth.getAuthorizeUrl()
    this.setState({ OAuthUrl: url })
  }

  handleClickQwOauth() {
    const { OAuthUrl } = this.state
    if (OAuthUrl) {
      window.location.href = OAuthUrl
    } else {
      showToast('请配置授权地址')
    }
  }

  render() {
    return (
      <View className='page-auth-index'>
        <ScrollView className='welcome-scrollview' scrollY scrollWithAnimation>
          <View className='title'>欢迎登录</View>
          <View className='sub-title'>数据透视·智慧赋能·全渠道管理</View>
          <View className='logo-con'>
            <Image className='m-bk' mode='widthFix' src={require('@/assets/imgs/login-bk.png')} />
            <Image className='s-bk' mode='widthFix' src={require('@/assets/imgs/login-icon.png')} />
          </View>
          <View className='btn-con'>
            <Image
              className='btn btn-img'
              mode='widthFix'
              onClick={this.handleClickQwOauth.bind(this)}
              src={require('@/assets/imgs/login-btn.png')}
            />
          </View>
        </ScrollView>
        <FtLogo />
        <SpToast />
      </View>
    )
  }
}
