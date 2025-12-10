/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect, useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { requestCallback } from '@/utils'
import { DeliveryForm } from '@/components/sp-page-components'
import './index.scss'

const initState = {
  selfDeliveryForm: {
    delivery_corp: { label: '商家自配送', value: 'SELF_DELIVERY' },
    delivery_code: '',
    self_delivery_operator_id: { label: '', value: '' },
    self_delivery_status: {},
    delivery_remark: null,
    delivery_pics: []
  },
  btnLoading: false,
  isCancleDelivery: false
}
function UpdateDeliveryStatus(props, ref) {
  const [state, setState] = useImmer(initState)

  const { selfDeliveryForm, btnLoading, isCancleDelivery } = state

  const { deliveryVis, orderInfo = {}, onClose = () => {} } = props

  useEffect(() => {
    if (Object.keys(orderInfo).length) {
      console.log('orderInfo', orderInfo)
      const {
        delivery_corp,
        delivery_corp_name,
        self_delivery_operator_id,
        self_delivery_operator_name,
        self_delivery_operator_mobile,
        delivery_code,
        orders_delivery_id,
        order_status,
        self_delivery_status
      } = orderInfo
      // debugger
      setState((v) => {
        v.selfDeliveryForm = {
          ...selfDeliveryForm,
          delivery_corp: { label: delivery_corp_name, value: delivery_corp },
          self_delivery_operator_id: {
            username: self_delivery_operator_name,
            mobile: self_delivery_operator_mobile,
            self_delivery_operator_id: self_delivery_operator_id
          },
          delivery_code,
          orders_delivery_id
        }
        v.isCancleDelivery =
          order_status == 'WAIT_BUYER_CONFIRM' && self_delivery_status == 'CONFIRMING'
      })
    }
  }, [orderInfo])
  console.log('selfDeliveryForm', selfDeliveryForm)

  const handleChangeDeliveryForm = (key, value) => {
    console.log('handleChangeDeliveryForm', key, value)

    setState((v) => {
      v.selfDeliveryForm = {
        ...selfDeliveryForm,
        [key]: value
      }
    })
  }

  const handleSubmit = () => {
    console.log(selfDeliveryForm)
    const {
      orders_delivery_id,
      delivery_corp,
      delivery_code,
      self_delivery_operator_id,
      self_delivery_status,
      delivery_remark,
      delivery_pics
    } = selfDeliveryForm
    let data = {}
    if (delivery_corp.value == 'SELF_DELIVERY') {
      data = {
        delivery_corp: delivery_corp.value,

        self_delivery_operator_id: isCancleDelivery
          ? self_delivery_operator_id.operator_id
          : self_delivery_operator_id.self_delivery_operator_id,
        self_delivery_status: self_delivery_status.value,
        delivery_remark,
        delivery_code,
        delivery_pics
      }
    } else {
      data = {
        delivery_corp: delivery_corp.value,
        delivery_code
      }
    }

    if (delivery_corp.value == 'SELF_DELIVERY') {
      if (!data.self_delivery_status) {
        Taro.showToast({
          icon: 'none',
          title: '请选择配送状态！'
        })
      }
    } else {
      if (!data.delivery_code) {
        Taro.showToast({
          icon: 'none',
          title: '请填写物流单号！'
        })
      }
    }
    console.log(orders_delivery_id, data)

    if (btnLoading) return
    requestCallback(
      async () => {
        const res = api.logistics.updateLogistics(orders_delivery_id, data)
        setState((v) => {
          v.btnLoading = true
        })
        return res
      },
      '更新成功',
      () => {
        setState((v) => {
          v.btnLoading = false
        })
        onClose('submit')
      },
      () => {
        setState((v) => {
          v.btnLoading = false
        })
      }
    )
  }

  return (
    <View className='update-delivery-status'>
      <AtFloatLayout isOpened={deliveryVis} onClose={onClose}>
        <DeliveryForm
          isUpdateDelivery
          isCancleDelivery={isCancleDelivery}
          selfDeliveryForm={selfDeliveryForm}
          onChangeForm={handleChangeDeliveryForm}
        />
        <View className='update-footer'>
          <AtButton className='update-btn' circle loading={btnLoading} onClick={handleSubmit}>
            更新订单配送状态
          </AtButton>
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default UpdateDeliveryStatus
