/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect, useImperativeHandle } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text } from '@tarojs/components'
import api from '@/api'
import { classNames } from '@/utils'
import { SpPicker } from '@/components'
import { FormItem, FormImageItem } from '../../../pages/good/comps'
import { SELFDELIVERYSTATUSLIST, UPDATESELFDELIVERYSTATUSLIST } from '@/consts'
import { LogisticsPicker } from '@/components/sp-page-components'
import './index.scss'

const initState = {
  deliveryStatusVis: false,
  opreaterVis: false,
  opreatorList: [],
  deliveryStatusVis: false,
  selfDeliveryStatusList: SELFDELIVERYSTATUSLIST
}
function DeliveryForm(props, ref) {
  const [state, setState] = useImmer(initState)

  const { deliveryVisible, opreaterVis, opreatorList, deliveryStatusVis, selfDeliveryStatusList } =
    state

  const {
    isUpdateDelivery = false, //更新发货
    isCancleDelivery, //取消配送
    receipt_type,
    selfDeliveryForm = {},
    onChangeForm = () => {}
  } = props

  useEffect(() => {
    setState((v) => {
      v.selfDeliveryStatusList =
        isUpdateDelivery && !isCancleDelivery
          ? UPDATESELFDELIVERYSTATUSLIST
          : SELFDELIVERYSTATUSLIST
    })
  }, [isUpdateDelivery, isCancleDelivery])

  const handleFormItemClick = async (key) => {
    switch (key) {
      case 'delivery_corp':
        if (isUpdateDelivery) return
        setState((v) => {
          v.deliveryVisible = true
        })
        break
      case 'self_delivery_operator_id':
        if (isUpdateDelivery && !isCancleDelivery) return
        const { list } = await api.order.getDeliveryList()
        setState((v) => {
          v.opreaterVis = true
          v.opreatorList = list
        })
        break
      case 'self_delivery_status':
        setState((v) => {
          v.deliveryStatusVis = true
        })
    }
  }

  const handleChangeForm = (key, value) => {
    console.log(key, value)
    let _value = value
    let activeDialogVis = null
    switch (key) {
      case 'self_delivery_operator_id':
        _value = opreatorList[value]
        activeDialogVis = 'opreaterVis'
        break
      case 'self_delivery_status':
        _value = selfDeliveryStatusList[value]
        activeDialogVis = 'deliveryStatusVis'
    }

    setState((v) => {
      v[activeDialogVis] = false
    })

    onChangeForm && onChangeForm(key, _value)
  }

  const handleDeliverySubmit = (current) => {
    setState((v) => {
      v.deliveryVisible = false
    })
    handleChangeForm('delivery_corp', { ...current, label: current.name })
  }

  return (
    <View className='delivery-form'>
      <FormItem
        label='快递公司'
        mode='selector'
        required
        placeholder='请输入快递公司'
        onClick={() => handleFormItemClick('delivery_corp')}
        value={selfDeliveryForm?.delivery_corp?.label}
      />
      {isUpdateDelivery && (
        <FormItem
          label='发货单号'
          mode='input'
          required
          editable={false}
          value={selfDeliveryForm.orders_delivery_id}
        />
      )}
      {selfDeliveryForm?.delivery_corp?.value != 'SELF_DELIVERY' && (
        <FormItem
          label='物流单号'
          mode='input'
          required
          placeholder='请输入物流单号'
          onChange={(value) => handleChangeForm('delivery_code', value)}
          value={selfDeliveryForm.delivery_code}
        />
      )}

      {selfDeliveryForm?.delivery_corp?.value == 'SELF_DELIVERY' && (
        <>
          <FormItem
            label='配送员'
            required
            mode='selector'
            placeholder='请选择配送员'
            onClick={() => handleFormItemClick('self_delivery_operator_id')}
            value={selfDeliveryForm.self_delivery_operator_id?.username}
          />
          {!isUpdateDelivery && (
            <FormItem
              label='配送员编号'
              mode='input'
              editable={false}
              placeholder=''
              value={selfDeliveryForm.self_delivery_operator_id?.staff_no}
            />
          )}
          <FormItem
            label='配送员手机号'
            mode='input'
            editable={false}
            placeholder=''
            value={selfDeliveryForm.self_delivery_operator_id?.mobile}
          />
          <FormItem
            label='配送状态'
            required
            mode='selector'
            placeholder='请选择配送员状态'
            onClick={() => handleFormItemClick('self_delivery_status')}
            value={selfDeliveryForm.self_delivery_status?.label}
          />
          <FormItem
            label='配送备注'
            mode='input'
            placeholder='请输入配送员备注'
            onChange={(value) => handleChangeForm('delivery_remark', value)}
            value={selfDeliveryForm.delivery_remark}
          />
          <FormImageItem
            label='照片上传'
            desc='(最多上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，建议尺寸：500*500px，不超过2M）'
            placeholder='请选择商品图片'
            onChange={(value) => handleChangeForm('delivery_pics', value)}
            value={selfDeliveryForm?.delivery_pics}
          />
        </>
      )}

      <SpPicker
        visible={opreaterVis}
        title='选择配送员'
        columns={opreatorList.map((item) => item.username)}
        onCancel={() =>
          setState((v) => {
            v.opreaterVis = false
          })
        }
        onClose={() =>
          setState((v) => {
            v.opreaterVis = false
          })
        }
        onConfirm={(value) => handleChangeForm('self_delivery_operator_id', value)}
      />

      <SpPicker
        visible={deliveryStatusVis}
        title='选择配送状态'
        columns={selfDeliveryStatusList.map((item) => item.label)}
        onCancel={() =>
          setState((v) => {
            v.deliveryStatusVis = false
          })
        }
        onClose={() =>
          setState((v) => {
            v.deliveryStatusVis = false
          })
        }
        onConfirm={(value) => handleChangeForm('self_delivery_status', value)}
      />

      <LogisticsPicker
        receipt_type={receipt_type}
        visible={deliveryVisible}
        onClose={() =>
          setState((v) => {
            v.deliveryVisible = false
          })
        }
        onConfirm={handleDeliverySubmit}
      />
    </View>
  )
}

export default DeliveryForm
