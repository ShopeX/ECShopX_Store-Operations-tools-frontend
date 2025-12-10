/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { showToast, strLength } from '@/utils'
import { AtInput } from 'taro-ui'
import { connect } from 'react-redux'
import api from '@/api'
import S from '@/spx'
import UploadUtil from '@/utils/UploadUtil'
import './index.scss'
import { SpToast } from '@/components'

const head = require('../../assets/imgs/my/head.png')
const defaultshop = require('@/assets/imgs/defaultshop.png')
@connect(({ planSelection }) => ({
  planSelection
}))
export default class My extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      mobile: '', // 手机
      head_portrait: '', // 个人头像
      work_userid: '', // 企业微信id
      distributors: null
    }
  }

  componentDidMount() {
    this.getMyInfoHandle()
  }
  componentDidShow() {
    this.getMyInfoHandle()
  }

  async getMyInfoHandle() {
    const obj = {
      is_app: 1
    }
    const result = await api.my.getMyinfo(obj)
    console.log(result)
    const { username, mobile, head_portrait, work_userid, distributors } = result
    this.setState({
      username,
      mobile,
      head_portrait,
      work_userid,
      distributors
    })

    this.state.distributors && this.format_distributors(this.state.distributors)
  }
  format_distributors(data) {
    const { activeShop } = this.props.planSelection
    if (activeShop) {
      let { distributor_id } = activeShop
      console.log(distributor_id)
      const result = data.filter((item) => {
        return item.distributor_id == distributor_id
      })
      this.setState(
        {
          distributors: result[0]
        },
        () => {
          console.log(this.state.distributors)
        }
      )
    }
  }

  notUpdate(message) {
    S.toast(`${message}暂不支持修改！`)
  }

  // 上传头像
  async handleAvatar() {
    const { tempFiles = [] } = await Taro.chooseImage({
      count: 1
    })
    console.log('tempFiles', tempFiles)
    const upload = new UploadUtil()

    console.log('upload', upload)

    const result = await upload.uploadImg(tempFiles[0])
    this.handleAvatarSuccess(result, tempFiles[0].originalFileObj)
  }

  async handleAvatarSuccess(res, file) {
    console.log('handleAvatarSuccess', res)
    let uploadParams = {
      image_cat_id: 2, //图片分类必填,必须为整数
      image_name: file.name, //图片名称必填,不能超过50个字符
      image_url: res.data ? JSON.parse(res.data).data.image_url : res.key, //图片链接必填
      image_type: file.type, //图片分类长度不能超过20个字符
      storage: 'image' //图片id必填
    }
    console.log(uploadParams)
    const result = await api.qiniu.uploadQiniuPic(uploadParams)
    this.setState({
      head_portrait: result.image_full_url
    })
    const resultConfig = await api.my.updateInfo({
      head_portrait: this.state.head_portrait
    })
    // showToast('修改成功')
  }

  photoUpdate() {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    console.log(input)
    input.click()
    input.addEventListener('change', async function () {
      const result = await api.my.updatePhoto({
        head_portrait: input.files[0]
      })
      console.log(result)

      console.log(input.files[0])
      input.remove()
    })
  }

  switchShopHandle() {
    Taro.redirectTo({
      url: '/pages/planSelection/index'
    })
  }

  usernameChange(value) {
    let str = strLength(value)
    if (str > 20) {
      return S.toast(`最多输入10个字符喔`)
    }
    this.setState({
      username: value
    })
  }

  async usernameBlur() {
    const result = await api.my.updateInfo({
      username: this.state.username
    })
    console.log(result)
  }

  onSubmit(event) {
    console.log(this.state.username)

    showToast(event)
    event.preventDefault()
    return false
  }

  render() {
    const { username, work_userid, mobile, head_portrait, distributors } = this.state
    return (
      <View className='page-my'>
        <View className='top'>
          <View className='info'>
            <View className='photo'>
              <Image src={(distributors && distributors.logo) || defaultshop}></Image>
            </View>
            <View className='content'>
              <View className='title'>{distributors && distributors.name}</View>
              {distributors && distributors.is_center && <View className='tag'>总部</View>}
            </View>
            <View className='switch-shop' onClick={this.switchShopHandle}>
              <Text className='iconfont icon-qiehuan1'></Text>
              <Text>切换店铺</Text>
            </View>
          </View>
        </View>
        <View className='joker'></View>
        <View className='formBox'>
          {/* <Form onSubmit={this.formSubmit.bind(this)}> */}
          <View className='photoBox'>
            <View className='title'>
              <Text className='iconfont icon-zu1684'></Text>
              <Text>我的头像</Text>
            </View>
            <View className='photo' onClick={(e) => this.handleAvatar()}>
              <Image src={head_portrait || head}></Image>
            </View>
          </View>
          <View className='common'>
            <View className='title'>
              <Text className='iconfont icon-shoujihao'></Text>
              <Text>手机号</Text>
            </View>
            <View className='value' onClick={(e) => this.notUpdate('手机号')}>
              {mobile}
            </View>
          </View>
          <View className='common'>
            <View className='title'>
              <Text className='iconfont icon-id'></Text>
              <Text>企业微信ID</Text>
            </View>
            <View className='value' onClick={(e) => this.notUpdate('企业微信ID')}>
              {work_userid}
            </View>
          </View>
          <View className='common borderNone'>
            <View className='title'>
              <Text className='iconfont icon-keai'></Text>
              <Text>我的昵称</Text>
            </View>
            <View className='value'>
              <AtInput
                name='value'
                type='text'
                placeholder='昵称'
                value={username}
                onChange={this.usernameChange.bind(this)}
                onBlur={this.usernameBlur.bind(this)}
              />
            </View>
          </View>
          {/* </Form> */}
        </View>
        <SpToast />
        {/* <Button className='btn'>修改密码</Button>
        <Button className='btn'>退出登录</Button> */}
      </View>
    )
  }
}
