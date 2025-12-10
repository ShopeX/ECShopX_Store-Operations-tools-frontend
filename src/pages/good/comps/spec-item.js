/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { SpTab, SpPicker, SpSpecSelector } from '@/components'
import { SelectInput, Tabbar, PageActionButtons } from '@/components/sp-page-components'
import { classNames } from '@/utils'
import { useImmer } from 'use-immer'
import FormItem from './form-item'
import { computeSpecs, usePrevious } from '../util'
import {
  STATUS_LIST,
  STATUS,
  STORE,
  SALE_PRICE,
  ITEM_BN,
  VOLUME,
  WEIGHT,
  COSTPRICE,
  MARKETPRICE,
  BARCODE
} from '../const'
import './spec-item.scss'

const initCommonState = {
  statusVisible: false
}

const CommonForm = (props) => {
  const { openSpec, info = {}, onChange = () => {}, id } = props

  const [state, setState] = useImmer(initCommonState)

  const { statusVisible } = state

  const handleChangeForm = (key) => (item) => {
    switch (key) {
      case STATUS:
        setState((_val) => {
          _val.statusVisible = false
        })
        onChange({ approve_status: STATUS_LIST[item] })
        break
      case STORE:
        onChange({ store: item })
        break
      case SALE_PRICE:
        onChange({ price: item })
        break
      case ITEM_BN:
        onChange({ item_bn: item })
        break
      case WEIGHT:
        onChange({ weight: item })
        break
      case VOLUME:
        onChange({ volume: item })
        break
      case COSTPRICE:
        onChange({ cost_price: item })
        break
      case MARKETPRICE:
        onChange({ market_price: item })
        break
      case BARCODE:
        onChange({ barcode: item })
        break
    }
  }

  const handleClickFormItem = (key) => () => {
    switch (key) {
      case STATUS:
        setState((_val) => {
          _val.statusVisible = true
        })
        break
    }
  }

  console.log(1, info)

  return (
    <View className='common-form'>
      {openSpec && (
        <FormItem
          label='规格值'
          mode='input'
          editable={false}
          placeholder='请选择规格值'
          value={info.sku_name}
        />
      )}
      <FormItem
        label='售卖状态'
        required
        mode='selector'
        placeholder='请选择售卖状态'
        onClick={handleClickFormItem(STATUS)}
        value={info.approve_status.label}
      />
      <FormItem
        label='商品库存'
        required
        mode='input'
        type='number'
        placeholder='请输入商品库存'
        onChange={handleChangeForm(STORE)}
        value={info.store}
      />
      <FormItem
        label='商品货号'
        mode='input'
        type='text'
        placeholder='请输入商品货号'
        onChange={handleChangeForm(ITEM_BN)}
        value={info.item_bn}
      />
      <FormItem
        label='重量'
        mode='input'
        type='text'
        placeholder='请输入商品重量'
        onChange={handleChangeForm(WEIGHT)}
        value={info.weight}
      />
      <FormItem
        label='体积'
        mode='input'
        type='text'
        placeholder='请输入商品体积'
        onChange={handleChangeForm(VOLUME)}
        value={info.volume}
      />
      <FormItem
        label='销售价'
        required
        mode='input'
        type='number'
        placeholder='请输入商品销售价'
        onChange={handleChangeForm(SALE_PRICE)}
        value={info.price}
      />
      <FormItem
        label='成本价'
        mode='input'
        type='text'
        placeholder='请输入商品成本价'
        onChange={handleChangeForm(COSTPRICE)}
        value={info.cost_price}
      />
      <FormItem
        label='市场价'
        mode='input'
        type='text'
        placeholder='请输入商品市场价'
        onChange={handleChangeForm(MARKETPRICE)}
        value={info.market_price}
      />
      <FormItem
        label='条形码'
        mode='input'
        type='text'
        placeholder='请输入商品条形码'
        onChange={handleChangeForm(BARCODE)}
        value={info.barcode}
      />

      <SpPicker
        visible={statusVisible}
        title='选择售卖状态'
        columns={STATUS_LIST.map((item) => item.label)}
        onCancel={() =>
          setState((_val) => {
            _val.statusVisible = false
          })
        }
        onClose={() =>
          setState((_val) => {
            _val.statusVisible = false
          })
        }
        onConfirm={handleChangeForm(STATUS)}
      />
    </View>
  )
}

const SINGLE_OBJ = {
  approve_status: {},
  store: undefined,
  price: undefined,
  item_bn: undefined
}

const initState = {
  selectSpecs: [SINGLE_OBJ],
  visible: false
}

const SpecItem = (props) => {
  const { openSpec, goodsSpec, onChange = () => {}, id, value: valueProp } = props

  const prevOpenSpec = usePrevious(openSpec)

  console.log('==prevOpenSpec==', prevOpenSpec)

  //选择的规格

  const [state, setState] = useImmer(initState)

  const { selectSpecs, visible } = state

  const handleChangeSku = (selected) => {
    console.log('==selected==', selected)
    let newArr = openSpec ? computeSpecs(selected, goodsSpec) : [SINGLE_OBJ]
    setState((_val) => {
      _val.selectSpecs = newArr
      _val.visible = false
    })
    onChange(newArr)
  }

  const handleChangeForm = (index) => (value) => {
    let newSelectSpecs = [...selectSpecs]
    let currentSpecs = newSelectSpecs[index]
    newSelectSpecs.splice(index, 1, {
      ...currentSpecs,
      ...value
    })
    setState((_val) => {
      _val.selectSpecs = newSelectSpecs
    })
    onChange(newSelectSpecs)
  }

  useEffect(() => {
    console.log('==valueProp==', valueProp)
    if (valueProp.length > 0) {
      setState((_val) => {
        _val.selectSpecs = [...valueProp]
      })
    }
  }, [valueProp])

  useEffect(() => {
    if (valueProp.length === 0) {
      if (openSpec) {
        setState((_val) => {
          _val.selectSpecs = []
        })
      }
    }
    if (!openSpec && prevOpenSpec === true) {
      setState((_val) => {
        _val.selectSpecs = [SINGLE_OBJ]
      })
    }
  }, [openSpec, valueProp])

  console.log('===selectSpecArr==', selectSpecs, id)

  return (
    <View
      className={classNames('spec-item', {
        'has-good-spec': openSpec
      })}
    >
      {openSpec && (
        <FormItem
          label='商品规格值'
          mode='selector'
          placeholder='请选择商品规格值'
          className='spec-good-item'
          onClick={() => {
            setState((_val) => {
              _val.visible = true
            })
          }}
        />
      )}
      {selectSpecs.map((specItem, specIndex) => {
        return (
          <CommonForm
            openSpec={openSpec}
            key={specIndex}
            info={specItem}
            onChange={handleChangeForm(specIndex)}
            id={id}
          />
        )
      })}
      <SpSpecSelector
        title='规格值选择'
        visible={visible}
        dataSource={goodsSpec}
        onChange={handleChangeSku}
        onClose={() => {
          setState((_val) => {
            _val.visible = false
          })
        }}
        onCancel={() => {
          setState((_val) => {
            _val.visible = false
          })
        }}
      />
    </View>
  )
}

export default SpecItem
