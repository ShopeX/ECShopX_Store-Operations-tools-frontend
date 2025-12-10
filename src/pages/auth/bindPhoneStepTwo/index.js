/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Component } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpToast } from '@/components'
import { getThemeStyle, validate, showToast } from '@/utils'
import api from '@/api'
import S from '@/spx'
import FtLogo from '../comps/ft-logo'
import './index.scss'

export default class BindPhone extends Component {
  state = {
    info: {
      mobile: '',
      vcode: '',
      imgcode: ''
    },
    work_userid: '',
    check_token: '',
    vcode: '',
    rightImgcode: {},
    loginType: 0 // 0:验证码登录；1:密码登录
  }

  getImgCode = async () => {
    const rightImgcode = await api.auth.getImageVerificationCode({
      type: 'sign'
    })
    this.setState({
      rightImgcode
    })
  }

  async componentDidShow() {
    const {
      router: {
        params: { phone, work_userid, check_token }
      }
    } = getCurrentInstance()
    this.setState({
      info: {
        mobile: phone
      },
      work_userid,
      check_token
    })
  }

  async handleSubmit() {
    const {
      info: { mobile },
      vcode,
      check_token,
      work_userid
    } = this.state
    const { status, token } = await api.auth.bindMobile({
      work_userid,
      check_token,
      mobile,
      vcode
    })
    if (token) {
      S.setAuthToken(token)
      const userInfo = await api.operator.getUserInfo()
      S.set('user_info', userInfo, true)
      Taro.redirectTo({ url: `/pages/planSelection/index` })
    } else {
      showToast('登录失败')
    }
  }

  async handleTimerStart() {
    const { mobile } = this.state.info
    if (!validate.isMobileNum(mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    await api.operator.sendCode({
      mobile
    })
  }

  handleTimerStop() {}

  handleInputChange = (vcode) => {
    this.setState({
      vcode
    })
  }

  render() {
    const { info, vcode } = this.state
    return (
      <View className='page-auth-bindphone' style={getThemeStyle()}>
        <ScrollView className='bindphone-scrollview' scrollY scrollWithAnimation>
          <View className='auth-hd'>
            <View className='title'>绑定手机号</View>
            <View className='desc'>请输入云店后台已注册手机号</View>
          </View>
          <View className='auth-bd'>
            <View className='form-title'>中国大陆 +86 {info.mobile} </View>
            <AtForm className='form'>
              <View className='form-field'>
                <AtInput
                  clear
                  name='vcode'
                  value={vcode}
                  placeholder='请输入您的验证码'
                  onChange={this.handleInputChange}
                />
              </View>

              <View className='form-submit'>
                <AtButton
                  circle
                  className='btn-submit'
                  type='primary'
                  onClick={this.handleSubmit.bind(this)}
                >
                  绑定
                </AtButton>
              </View>
            </AtForm>
          </View>
        </ScrollView>
        <FtLogo />
        <SpToast />
      </View>
    )
  }
}
