/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { Component, createElement } from 'react'
import { View, Image, Form, Input, Button, Picker, Text } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtFloatLayout } from 'taro-ui'
import { showToast } from '@/utils'
import api from '@/api'
import { SpPickerZ } from '@/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
const logo = require('../../assets/imgs/arrow.png')
@connect(({ planSelection }) => ({
  planSelection: planSelection.activeShop
}))
export default class SpEditForm extends Component {
  constructor() {
    super()
    this.state = {
      addressList: null,
      Cityinfo: '',
      province: '',
      city: '',
      area: '',
      username: '',
      phone: '',
      addressDetail: '',
      selectList: null,
      isShow: false
    }
  }
  handleChange(value) {
    this.setState({
      value
    })
  }
  formatArr(arr) {
    arr.forEach((element) => {
      element = `'${element}'`
    })
    return arr
  }
  async onSubmit(event) {
    let { distributor_id } = this.props.planSelection
    const { city, province, area, username, phone, addressDetail, Cityinfo } = this.state
    const formatCityinfo = Cityinfo.path.split(',')
    if (city && username && phone && addressDetail) {
      const obj = {
        distributor_id: `["${distributor_id}"]`,
        province,
        city,
        area,
        regions_id: `["${formatCityinfo[0]}","${formatCityinfo[1]}","${formatCityinfo[2]}"]`,
        address: addressDetail,
        regions: `["${province}","${city}","${area}"]`,
        contact: username,
        mobile: phone
      }

      const { result } = await api.address.postAddressList(obj)
      const { address_id } = result
      console.log(address_id)
      const params = {
        address_id,
        set_default: 1
      }
      const res = await api.address.updateAddressActive(params)
      if (res.status) {
        showToast('ok')
        Taro.navigateTo({
          url: `/pages/afterSales/deal?address_id=${address_id}`
        })
      } else {
        showToast('失败')
      }
    } else {
      showToast('请输入完整信息')
      return
    }
    // const
    // console.log(this.state.value)
  }
  isShowHandle() {
    this.setState({
      isShow: false
    })
  }
  // 获取省市区子组件的数据
  getCityHandle(province, city, area, seletedItem) {
    // const {province,city,area,seletedItem} = CityObj
    console.log(province, city, area, seletedItem)
    this.setState({
      Cityinfo: seletedItem,
      city,
      area,
      province,

      // city:province+'/'+city+'/'+area,
      isShow: false
    })
    // console.log(this.state.Cityinfo.path.split(','));
    // const a = this.formatArr(this.state.Cityinfo.path.split(','))
    // console.log(a);
  }
  // 获取所有地区数据
  async GET_areaList() {
    const result = await api.address.areaList()
    this.setState({
      selectList: result
    })
    console.log(result)
  }

  // 打开弹窗
  openPicker() {
    this.setState({
      isShow: true
    })
  }

  usernameChangeHandle(event) {
    this.setState({
      username: event
    })
  }
  addressDetailChangeHandle(value) {
    this.setState({
      addressDetail: value
    })
  }
  phoneChangeHandle(value) {
    this.setState({
      phone: value
    })
  }

  componentDidMount() {
    this.GET_areaList()
  }
  render() {
    const { province, city, area, username, phone, addressDetail, isShow, Cityinfo } = this.state
    return (
      <View className='sp-editForm'>
        <View className='box'>
          <View className='title'></View>
          <View className='content'>
            <AtForm>
              <View className='selectCity' onClick={(e) => this.openPicker()}>
                <View className='label'>所在地区</View>
                <View className='city'>
                  {Cityinfo ? (
                    <Text>{province + city + area}</Text>
                  ) : (
                    <Text className='default'>所在省市</Text>
                  )}
                </View>
                <View className='value'>
                  <Text className='iconfont icon-jiantou'></Text>
                </View>
              </View>
              <AtInput
                name='value'
                title='联系人'
                type='text'
                placeholder='售后联系人姓名'
                value={username}
                onChange={(e) => this.usernameChangeHandle(e)}
              />
              <AtInput
                name='value'
                title='联系方式'
                type='text'
                placeholder='售后联系人手机或座机号码'
                value={phone}
                onChange={(e) => this.phoneChangeHandle(e)}
              />
              <AtInput
                name='value'
                title='详细地址'
                type='text'
                placeholder='详细到门牌号'
                value={addressDetail}
                onChange={(e) => this.addressDetailChangeHandle(e)}
              />
            </AtForm>
          </View>
        </View>

        <View className='confirm'>
          <View className='btn' onClick={(e) => this.onSubmit()}>
            新增并选择
          </View>
        </View>
        {this.state.selectList && (
          <AtFloatLayout isOpened={this.state.isShow}>
            <SpPickerZ
              getCityHandle={this.getCityHandle.bind(this)}
              isShowHandle={(e) => this.isShowHandle()}
              selectList={this.state.selectList}
            ></SpPickerZ>
          </AtFloatLayout>
        )}
      </View>
    )
  }
}
