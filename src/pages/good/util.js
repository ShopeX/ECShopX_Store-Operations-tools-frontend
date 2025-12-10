/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { navigateTo } from '@tarojs/taro'
import React, { useRef, useEffect } from 'react'

export const navigateToGoodForm = (id) => {
  if (!id) {
    return navigateTo({
      url: `/pages/good/form`
    })
  }
  navigateTo({
    url: `/pages/good/form?id=${id}`
  })
}

export function transformData(data, obj) {
  let list = []
  data.forEach((item) => {
    let currentItem = {}
    for (let key in obj) {
      currentItem[obj[key]] = item[key]
    }
    if (item.children) {
      currentItem.children = transformData(item.children, obj)
    }
    list.push(currentItem)
  })
  return list
}

export function flattenSpecs(dataSource) {
  return dataSource.reduce((total, current) => {
    return total.concat(current.attribute_values.list)
  }, [])
}

export function findSpec(skuids, SpecData) {
  const allSpecs = flattenSpecs(SpecData)
  return skuids.reduce((total, current) => {
    let matchSpec = allSpecs.find((spec) => spec.attribute_value_id === current)
    return total.concat([matchSpec])
  }, [])
}

function dealSpecs(arr, SpecData) {
  const multiSpec = {
    approve_status: {},
    store: undefined,
    price: undefined
  }
  //['209-黑色', '212-6GB', '215-官方标配']=>{sku_id:'209-212-215',...}
  return arr.reduce((total, current, index) => {
    const skuid = current.map((item) => item.split('-')[0])
    const skuname = current.map((item) => item.split('-')[1])
    return total.concat({
      ...multiSpec,
      is_default: index === 0 ? true : false,
      sku_id: skuid.join('-'),
      sku_name: skuname.join('、'),
      item_spec: findSpec(skuid, SpecData).map((item) => ({
        spec_id: item.attribute_id,
        spec_value_id: item.attribute_value_id,
        spec_value_name: item.attribute_value,
        spec_custom_value_name: item.attribute_value
      }))
    })
  }, [])
}

export function transformDetail(detail) {
  if (detail.length === 0) return ''
  return detail.map((_item) => `<img src='${_item}' />`).join('')
}

export function computeSpecs(obj, SpecData) {
  console.log('==SpecData==', SpecData)
  let result = []

  let selectArr = Object.values(obj)

  if (selectArr.length === 0) {
    return []
  }

  function help(selectIndex, prev) {
    let select = selectArr[selectIndex]
    let isLast = selectIndex === selectArr.length - 1

    for (let val of select) {
      let cur = prev.concat(val)
      if (isLast) {
        result.push(cur)
      } else {
        help(selectIndex + 1, cur)
      }
    }
  }

  help(0, [])

  return dealSpecs(result, SpecData)
}

export function usePrevious(state, compare = true) {
  const previous = useRef()

  useEffect(() => {
    const needUpdate = typeof compare === 'function' ? compare(previous.current, state) : compare

    if (needUpdate) {
      previous.current = state
    }
  })

  return previous.current
}
