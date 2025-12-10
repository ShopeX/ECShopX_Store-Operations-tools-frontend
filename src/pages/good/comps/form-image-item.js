/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { SpTab, SpGoodPrice } from '@/components'
import { SelectInput, Tabbar, PageActionButtons } from '@/components/sp-page-components'
import { getThemeStyle, classNames, isUndefined } from '@/utils'
import { useImmer } from 'use-immer'
import { AtInput, AtSwitch, AtInputNumber } from 'taro-ui'
import { useDepChange } from '@/hooks'
import UploadUtil from '@/utils/UploadUtil'
import api from '@/api'
import './form-image-item.scss'

const initState = {
  value: []
}

const FormImageItem = (props) => {
  const {
    label,
    required = false,
    onClick = () => {},
    onChange: onChangeProp = () => {},
    className,
    desc,
    value: valueProp
  } = props

  const [state, setState] = useImmer(initState)

  const { value } = state

  const handleUploader = async () => {
    const { tempFiles = [] } = await Taro.chooseImage({
      count: 1
    })
    const upload = new UploadUtil()
    const result = await upload.uploadImg(tempFiles[0].originalFileObj)
    await handleUploaderSuccess(result, tempFiles[0].originalFileObj)
  }

  const handleUploaderSuccess = async (res, file) => {
    let uploadParams = {
      image_cat_id: 2, //图片分类必填,必须为整数
      image_name: file.name, //图片名称必填,不能超过50个字符
      image_url: res.data ? JSON.parse(res.data).data.image_url : res.key, //图片链接必填
      image_type: file.type, //图片分类长度不能超过20个字符
      storage: 'image' //图片id必填
    }
    const { image_full_url } = await api.qiniu.uploadQiniuPic(uploadParams)
    await setState((_val) => {
      _val.value = [...value, image_full_url]
    })
  }

  useDepChange(() => {
    onChangeProp(value)
  }, [value])

  const handleDelete = (index) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    setState((_val) => {
      _val.value = newValue
    })
  }

  useEffect(() => {
    if (valueProp?.length > 0 && value?.length === 0) {
      setState((_val) => {
        _val.value = [...valueProp]
      })
    }
  }, [valueProp])

  return (
    <View className={classNames('form-image-item', className)}>
      {required && <View className='form-image-item-required'>*</View>}
      <View className='form-image-item-label'>{label}</View>
      <View className='form-image-item-desc'>{desc}</View>
      <View className='form-image-item-main' onClick={onClick}>
        {console.log(123, value)}
        {value.map((val, index) => (
          <View className='uploader'>
            <Image src={val} className='uploader-image' />
            <View
              className='uploader-close'
              onClick={() => {
                handleDelete(index)
              }}
            >
              <Text className='iconfont icon-guanbi'></Text>
            </View>
          </View>
        ))}
        <View className='add' onClick={handleUploader}>
          <View className='iconfont icon-tianjia1'></View>
        </View>
      </View>
    </View>
  )
}

export default FormImageItem
