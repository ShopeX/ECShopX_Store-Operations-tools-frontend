/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { AtFloatLayout } from 'taro-ui'
import { classNames } from '@/utils'
import React, { useRef, useEffect } from 'react'
import { Textarea as TaroTextarea } from '@tarojs/components'
import './index.scss'

const Textarea = (props) => {
  const { placeholder, value, onChange = () => {} } = props

  const textareaRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      // let pos = textareaRef.current.textContent.indexOf(`\n`);
      // textareaRef.current.setSelectionRange(pos+1, pos+1);
      textareaRef.current.focus()
      textareaRef.current.click()
    }, 200)
  }, [])

  return (
    <textarea
      className='h5-textarea'
      autoFocus
      ref={textareaRef}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

export default Textarea
