/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import { ActionSheet } from '@/components/sp-page-components'
import { SpLoading, SpFilterButton } from '@/components'
import { View, ScrollView, Image } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { transformData, isUndefined, isArray, expandSpecs } from '@/utils'
import { classNames } from '../../utils'
import './index.scss'

const selected_img = require('../../assets/imgs/selected.png')

const initState = {
  //key 为 '${parent_id}_${parent_name}' value为子数组
  selectedSpecs: {}
}

const SpSpecSelector = (props) => {
  const {
    visible,
    onClose: onCloseProp = () => {},
    onCancel = () => {},
    title,
    dataSource = [],
    onChange: onChangeProp = () => {}
  } = props

  const [state, setState] = useImmer(initState)

  const { selectedSpecs } = state

  const handleClickAttr = (childrenItem, parentItem) => {
    let lastSelectedSpecs = { ...selectedSpecs }
    const { attribute_id: parent_attr_id, attribute_name: parent_attr_name } = parentItem
    const { attribute_value_id: children_attr_id, attribute_value: children_attr_name } =
      childrenItem

    let parentKey = `${parent_attr_id}-${parent_attr_name}`

    let childrenKey = `${children_attr_id}-${children_attr_name}`

    let currentItem = lastSelectedSpecs[parentKey]

    //已经选中
    const selected = (currentItem || []).findIndex((item, index) => item === childrenKey) > -1

    //如果没有值
    if (isUndefined(currentItem) || currentItem.length === 0) {
      lastSelectedSpecs[parentKey] = [childrenKey]
    } else if (currentItem.length > 0) {
      if (selected) {
        lastSelectedSpecs[parentKey] = currentItem.filter((_item) => _item !== childrenKey)
      } else {
        lastSelectedSpecs[parentKey] = [...currentItem, childrenKey]
      }
    }

    setState((_val) => {
      _val.selectedSpecs = lastSelectedSpecs
    })
  }

  useEffect(() => {}, [])

  const allSelectIds = expandSpecs(selectedSpecs)

  const handleConfirm = () => {
    onChangeProp(selectedSpecs)
  }

  return (
    <ActionSheet
      visible={visible}
      onClose={onCloseProp}
      onCancel={onCancel}
      title={title}
      className='sp-spec-selector'
      onConfirm={handleConfirm}
    >
      {dataSource.length > 0 ? (
        <ScrollView className='sp-spec-selector-scrolllist' scrollY>
          {dataSource.map((dataItem, idx) => {
            const buttons = dataItem.attribute_values.list

            return (
              <View className='sp-spec-selector-scrolllist-item' key={idx}>
                <View className='item-attr-name'>{dataItem.attribute_name}</View>
                <View className='item-attr-content'>
                  {buttons.map((item) => (
                    <View
                      className={classNames('item-attr-content-button', {
                        'active': allSelectIds.some((_item) => _item === item.attribute_value_id)
                      })}
                      onClick={() => {
                        handleClickAttr(item, dataItem)
                      }}
                      key={item.attribute_value}
                    >
                      {item.attribute_value}
                      <Image src={selected_img} className='selected_img' />
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
        </ScrollView>
      ) : (
        <SpLoading />
      )}
    </ActionSheet>
  )
}

export default SpSpecSelector
