/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, ScrollView } from '@tarojs/components'
import api from '@/api'
import { showToast, isIos, qwsdk, getCurrentRoute } from '@/utils'
import S from '@/spx'
import FtLogo from '../comps/ft-logo'
import { SpToast } from '@/components'
import './index.scss'

function decodeBase64Json(raw) {
  if (!raw || typeof raw !== 'string') return null
  try {
    return JSON.parse(atob(raw))
  } catch (e) {
    return null
  }
}

function decodeJwtPayload(token) {
  const parts = String(token).split('.')
  if (parts.length < 2) return null
  try {
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4
    if (pad) b64 += '='.repeat(4 - pad)
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

/** 从 URL token（JWT 或 Base64 JSON）解析 trust_login_token，供作为 login_name 传给 /operator/trusted_login */
function getTrustLoginTokenValue(token) {
  if (!token || typeof token !== 'string') return ''
  const payload = decodeJwtPayload(token.trim())
  const sub = payload && payload.sub
  const subObj =
    typeof sub === 'string'
      ? decodeBase64Json(sub) || decodeBase64Json(decodeURIComponent(sub))
      : sub
  const trustToken =
    (subObj && subObj.trust_login_token) ||
    (sub && sub.trust_login_token) ||
    (payload && payload.trust_login_token)
  if (trustToken != null && trustToken !== '') {
    return String(trustToken)
  }
  try {
    const raw = atob(token.trim())
    const parsed = JSON.parse(raw)
    const parsedSub = parsed && parsed.sub
    const parsedSubObj =
      typeof parsedSub === 'string'
        ? decodeBase64Json(parsedSub) || decodeBase64Json(decodeURIComponent(parsedSub))
        : parsedSub
    const parsedToken =
      (parsedSubObj && parsedSubObj.trust_login_token) ||
      (parsedSub && parsedSub.trust_login_token) ||
      (parsed && parsed.trust_login_token)
    if (parsedToken != null && parsedToken !== '') {
      return String(parsedToken)
    }
  } catch (e) {}
  return ''
}

export default class Index extends Component {
  state = {
    ...this.state,
    OAuthUrl: ''
  }

  async componentDidMount() {
    const that = this
    const { params } = getCurrentRoute()
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
    console.log('auth:init:token', token)
    if (token) {
      this.trustedLoginThenEnter(token, company_id)
    } else {
      if (code) {
        this.workwechatOauthLogin(code, company_id)
      } else {
        this.getAuthorizeUrl()
      }
    }
  }

  /**
   * 免登：解码 URL token 取 trust_login_token，仍以 login_name 字段调 trusted_login 换正式 token
   */
  async trustedLoginThenEnter(trustedToken, company_id) {
    const login_name = getTrustLoginTokenValue(trustedToken)
    const cid = company_id != null && company_id !== '' ? company_id : 1
    const tokenPayload = decodeJwtPayload(trustedToken)
    console.log('auth:trustedTokenPayload', tokenPayload)
    console.log('auth:trustedLoginParams', {
      company_id: cid,
      hasToken: Boolean(trustedToken),
      login_name
    })
    Taro.setStorageSync('company_id', String(cid))
    S.logout()
    if (!login_name) {
      showToast('免登参数异常，请检查 token 内容')
      return
    }
    try {
      const data = await api.auth.trustedLogin({ login_name, company_id: cid })
      const realToken = data && data.token
      if (!realToken) {
        showToast('登录失败，请重试')
        return
      }
      await this.persistSessionAndRedirect(realToken)
    } catch (e) {
      console.error('trustedLogin', e)
      showToast((e && e.message) || '登录失败')
    }
  }

  async persistSessionAndRedirect(token) {
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
      this.persistSessionAndRedirect(token)
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
