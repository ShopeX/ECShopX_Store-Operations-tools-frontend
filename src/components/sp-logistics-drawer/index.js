/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React from 'react'
import { SpAutoFocusDrawer } from '@/components'
import S from '@/spx'

const SpLogisticsDrawer = (props) => {
  const {
    visible,
    onClose = () => {},
    title,
    placeholder = '请输入物流单号',
    onConfirm,
    defaultValue
  } = props

  const handleConfirm = (value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      S.toast('物流单号填写有误')
      return
    }
    onConfirm?.(value)
  }

  return (
    <SpAutoFocusDrawer
      visible={visible}
      onClose={onClose}
      onCancel={onClose}
      title={title}
      placeholder={placeholder}
      onConfirm={handleConfirm}
      defaultValue={defaultValue}
    />
  )
}

export default React.memo(SpLogisticsDrawer)
