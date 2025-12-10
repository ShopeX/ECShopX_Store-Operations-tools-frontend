/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { useState } from 'react'

const MIN_DISTANCE = 10

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal'
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical'
  }
  return ''
}

export default function useTouch() {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [direction, setDirection] = useState('')

  const isVertical = () => direction === 'vertical'
  const isHorizontal = () => direction === 'horizontal'

  const reset = () => {
    setDeltaX(0)
    setDeltaY(0)
    setOffsetX(0)
    setOffsetY(0)
    setDirection('')
  }

  const start = (event) => {
    reset()
    setStartX(event.touches[0].clientX)
    setStartY(event.touches[0].clientY)
  }

  const move = (event) => {
    const touch = event.touches[0]
    let eventDeltaX = touch.clientX < 0 ? 0 : touch.clientX - startX
    let eventDeltaY = touch.clientY - startY
    let eventOffsetX = Math.abs(eventDeltaX)
    let eventOffsetY = Math.abs(eventDeltaY)

    // Fix: Safari back will set clientX to negative number
    setDeltaX(eventDeltaX)
    setDeltaY(eventDeltaY)
    setOffsetX(eventOffsetX)
    setOffsetY(eventOffsetY)

    if (!direction) {
      setDirection(getDirection(eventOffsetX, eventOffsetY))
    }
  }

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  }
}
