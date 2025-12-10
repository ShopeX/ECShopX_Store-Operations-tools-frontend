/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useState } from 'react'
import useStateCallback from './useStateCallback'
import { log } from '@/utils'
import throttle from 'lodash/throttle'

export default function useBackToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  const [scrollTop, setScrollTop] = useStateCallback(null)

  //点击滚回按钮
  const scrollBackToTop = () => {
    // workaround for h5
    setScrollTop(1, () => {
      setScrollTop(null)
    })
  }

  const handleScroll = throttle((e) => {
    const { scrollTop: eventScrollTop, scrollHeight } = e.detail
    const offset = 300

    if (scrollHeight < 600) return
    if (eventScrollTop > offset && !showBackToTop) {
      log.debug(`[BackToTop] showBackToTop, scrollTop: ${eventScrollTop}`)
      setShowBackToTop(true)
    } else if (showBackToTop && eventScrollTop <= offset) {
      log.debug(`[BackToTop] hideBackToTop, scrollTop: ${eventScrollTop}`)
      setShowBackToTop(false)
    }
  }, 70)

  return {
    showBackToTop,
    scrollTop,
    handleScroll,
    scrollBackToTop
  }
}
