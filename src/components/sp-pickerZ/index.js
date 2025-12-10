/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, Image, Text, Picker, ScrollView } from '@tarojs/components'
import api from '@/api'
import './index.scss'
import Taro from '@tarojs/taro'
import { AtList, AtListItem } from 'taro-ui'

export default class ChangeWL extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      province: '',
      city: '',
      area: '',
      cityList: null,
      areaList: null,
      seletedItem: null
    }
  }

  seletedHanle(item, index) {
    let el = document.getElementsByClassName('wrap_area')
    for (let i = 0; i < el.length; i++) {
      el[i].style.display = 'none'
    }
    if (index == 0) {
      this.setState({
        province: item.label,
        cityList: item.children
      })
    } else if (index == 1) {
      this.setState({
        city: item.label,
        areaList: item.children
      })
    }
    el[index + 1].style.display = 'block'
  }
  seletedAreaHanle(item) {
    this.setState({
      area: item.label,
      seletedItem: item
    })
  }

  seletedprimary(id) {
    let el = document.getElementsByClassName('wrap_area')
    for (let index = 0; index < el.length; index++) {
      el[index].style.display = 'none'
    }
    if (id == 0) {
      this.setState({
        province: '',
        city: '',
        area: ''
      })
    } else if (id == 1) {
      this.setState({
        city: '',
        area: ''
      })
    }
    el[id].style.display = 'block'
  }

  render() {
    const { province, city, area, cityList, areaList, seletedItem } = this.state
    const { selectList, isShowHandle, getCityHandle } = this.props
    return (
      <View className='cpn-picker'>
        <View className='cover'>
          <View className='bar'>
            <View className='left' onClick={isShowHandle}>
              取消
            </View>
            <View className='center'>
              <View className='title'>所在区域</View>
              <View className='subtitle'>请选择您所在的省份、城市、区县</View>
            </View>
            <View
              className='right'
              onClick={(e) => getCityHandle(province, city, area, seletedItem)}
            >
              确定
            </View>
          </View>
          <View className='content'>
            <View className='primary'>
              <View className='primaryBox'>
                {province ? (
                  <View
                    className='seleted'
                    style={{ textAlign: 'left' }}
                    onClick={(e) => this.seletedprimary(0)}
                  >
                    {province}
                  </View>
                ) : (
                  <View className='select'>请选择</View>
                )}
              </View>

              <View className='primaryBox'>
                {province ? (
                  city ? (
                    <View
                      className='seleted'
                      style={{ textAlign: 'center' }}
                      onClick={(e) => this.seletedprimary(1)}
                    >
                      {city}
                    </View>
                  ) : (
                    <View className='select'>请选择</View>
                  )
                ) : null}
              </View>

              <View className='primaryBox'>
                {city ? (
                  area ? (
                    <View className='seleted' style={{ textAlign: 'right' }}>
                      {area}
                    </View>
                  ) : (
                    <View className='select'>请选择</View>
                  )
                ) : null}
              </View>
            </View>
            <ScrollView className='wrap_area show'>
              {selectList &&
                selectList.map((item) => {
                  return (
                    <View
                      key={item.label}
                      className={'item ' + (item.label == province && 'active')}
                      onClick={(e) => this.seletedHanle(item, 0)}
                    >
                      {item.label}
                    </View>
                  )
                })}
            </ScrollView>
            <ScrollView className='wrap_area'>
              {cityList &&
                cityList.map((item) => {
                  return (
                    <View
                      key={item.label}
                      className={'item ' + (item.label == city && 'active')}
                      onClick={(e) => this.seletedHanle(item, 1)}
                    >
                      {item.label}
                    </View>
                  )
                })}
            </ScrollView>
            <ScrollView className='wrap_area'>
              {areaList &&
                areaList.map((item) => {
                  return (
                    <View
                      key={item.label}
                      className={'item ' + (item.label == area && 'active')}
                      onClick={(e) => this.seletedAreaHanle(item)}
                    >
                      {item.label}
                    </View>
                  )
                })}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
