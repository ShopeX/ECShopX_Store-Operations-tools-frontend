/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent } from 'react'
import { View, Text, Input, Form } from '@tarojs/components'
import { AtForm, AtInput } from 'taro-ui'
import { classNames } from '@/utils'
import { FieldSelect } from '@/components/sp-page-components'
import './index.scss'
import { ORDER_LIST_FIELDS, afterSales, good } from '@/consts'

const getListAboutPage = (pageType) => {
  let returnArr = []
  if (pageType === 'orderList') {
    returnArr = Object.keys(ORDER_LIST_FIELDS).map((key) => ({
      value: key,
      label: ORDER_LIST_FIELDS[key]
    }))
  } else if (pageType === 'afterSalesList') {
    returnArr = Object.keys(afterSales.LIST_FIELDS).map((key) => ({
      value: key,
      label: afterSales.LIST_FIELDS[key]
    }))
  } else if (pageType === 'goodList') {
    returnArr = Object.keys(good.LIST_FIELDS).map((key) => ({
      value: key,
      label: good.LIST_FIELDS[key]
    }))
  }
  return returnArr
}

class SearchInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalShow: false,
      dataSource: []
    }
  }

  componentDidMount() {
    const { paramChange, pageType, inputParam } = this.props
    const dataSource = getListAboutPage(pageType)
    if (!inputParam) {
      paramChange(dataSource[0])
    }
    this.setState({
      dataSource
    })
    //h5:没有回车事件 故监听keyup keydown也无效
    window.addEventListener('keyup', this.handleSubmit)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleSubmit)
  }

  handleSubmit = (e) => {
    console.log('e', e)
    //苹果回车键which=13 完成键=55/88
    if (
      (e.code === 'Enter' ||
        e.key === 'Enter' ||
        e.which === 13 ||
        e.which === 55 ||
        e.which === 88) &&
      this.props.onInputConfirm
    ) {
      this.props.onInputConfirm({ isResetList: true })
    }
  }

  //点击筛选modal框其他地方
  handleFilterModalClickAway = (e) => {
    // console.log("handleFilterModalClickAway",e.target.id)
    // if (
    //   e.target.id === 'custom_input' ||
    //   e.target.id === 'custom_input_arrow' ||
    //   e.target.id === 'custom_input_text'
    // ) {
    //   return
    // }
    this.setState({
      modalShow: false
    })
  }

  //点击search事件
  clickSearch = () => {
    this.setState({
      modalShow: true
    })
  }

  handleClickField = (selectField) => {
    const { paramChange } = this.props
    if (paramChange) {
      paramChange(selectField)
    }
    this.setState({
      modalShow: false
    })
  }

  handleChangeInput = (e) => {
    const { valueChange } = this.props
    if (valueChange) {
      valueChange(e)
    }
  }

  render() {
    const { modalShow, dataSource } = this.state

    const { inputParam, inputValue } = this.props

    return (
      <View className='sp-page-search-input'>
        <View className='title' id='custom_input' onClick={this.clickSearch}>
          <Text id='custom_input_text'>{inputParam ? inputParam.label : ''}</Text>
          <Text
            className={classNames('iconfont', 'icon-xiala-01', {
              ['isModalShow']: modalShow
            })}
            id='custom_input_arrow'
          ></Text>
        </View>
        <View className='input'>
          {/* <AtForm action="" onSubmit={this.handleInputConfirm}> */}
          <AtInput
            className='at-input'
            placeholder='请输入想要搜索的内容'
            border={false}
            name='a'
            value={inputValue}
            onChange={this.handleChangeInput}
          />
          {/* </AtForm> */}
        </View>

        <FieldSelect
          dataSource={dataSource}
          visible={modalShow}
          onClickAway={this.handleFilterModalClickAway}
          onClickField={this.handleClickField}
        />
      </View>
    )
  }
}

export default SearchInput
