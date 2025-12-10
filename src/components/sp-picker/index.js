/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import Taro from '@tarojs/taro'
import { classNames, range } from '@/utils'
import { useTouch } from '@/hooks'
import { preventDefault } from '@/utils/dom'

import './index.scss'

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 100
const MOMENTUM_LIMIT_DISTANCE = 15

const DEFAULT_DURATION = 100

const SpPicker = (props) => {
  const {
    //可视item数量
    visibleItemCount = 6,
    //单个item的高度
    itemHeight = 100,
    //传入的值
    columns = ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
    //picker标题
    title = '操作弹框',
    //picker头部左边的文案
    onCancelText = '取消',
    //picker头部右边的文案
    onConfirmText = '确定',
    //点击头部右边的按钮
    onConfirm = () => {},
    //点击头部左边的按钮
    onCancel = () => {},
    //点击mark层
    onClose = () => {},
    className,
    visible,
    swipeDuration = 1000,
    type = 'normal',
    //确定按钮的类型
    confirmType,
    onChange = () => {},
    startIndex = 0
  } = props

  const { move, start, isVertical, deltaY } = useTouch()

  const [offset, setOffset] = useState(0)

  const [duration, setDuration] = useState(0)

  const [currentIndex, setCurrentIndex] = useState(startIndex)

  const count = () => columns.length

  //是否正在移动
  const moving = useRef(false)

  const startOffset = useRef()

  const touchStartTime = useRef()

  const momentumOffset = useRef()

  const transitionEndTrigger = useRef()

  //外层包裹节点
  const wrapper = useRef(null)

  function getElementTranslateY(element) {
    const style = window.getComputedStyle(element)
    const transform = style.transform || style.webkitTransform
    const translateY = transform.slice(7, transform.length - 1).split(', ')[5]

    return Number(translateY)
  }

  const getIndexByOffset = (offset) => range(Math.round(-offset / itemHeight), 0, count() - 1)

  const momentum = (distance, duration) => {
    const speed = Math.abs(distance / duration)

    distance = offset + (speed / 0.003) * (distance < 0 ? -1 : 1)

    const index = getIndexByOffset(distance)

    setDuration(+swipeDuration)

    setIndex(index)
  }

  const baseOffset = () => {
    return (itemHeight * (+visibleItemCount - 1)) / 2
  }

  const handleTouchStart = (event) => {
    let eventStartOffset
    start(event)

    if (moving.current) {
      const translateY = getElementTranslateY(wrapper.current)
      eventStartOffset = Math.min(0, translateY - baseOffset())
      setOffset(eventStartOffset)
      startOffset.current = eventStartOffset
    } else {
      startOffset.current = offset
    }
    setDuration(0)
    touchStartTime.current = Date.now()
    momentumOffset.current = startOffset.current
    transitionEndTrigger.current = null
  }

  const handleTouchMove = (event) => {
    move(event)

    if (isVertical()) {
      console.log('isVertical()')

      moving.current = true
      preventDefault(event, true)
    }

    let rangeOffset = range(startOffset.current + deltaY, -(count() * itemHeight), itemHeight)

    setOffset(rangeOffset)

    const now = Date.now()

    if (now - touchStartTime.current > MOMENTUM_LIMIT_TIME) {
      touchStartTime.current = now
      momentumOffset.current = rangeOffset
    }
  }

  const handleTouchEnd = () => {
    const distance = offset - momentumOffset.current
    const duration = Date.now() - touchStartTime.current

    const allowMomentum =
      duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE

    if (allowMomentum) {
      momentum(distance, duration)
      return
    }
    const index = getIndexByOffset(offset)
    setDuration(DEFAULT_DURATION)
    setIndex(index, true)

    setTimeout(() => {
      moving.current = false
    }, 0)
  }

  const wrapperStyle = {
    transform: `translate3d(0, ${Taro.pxTransform(offset + baseOffset())}, 0)`,
    transitionDuration: `${duration}ms`,
    transitionProperty: duration ? 'all' : 'none'
  }

  const adjustIndex = (index) => {
    index = range(index, 0, count())

    return index
  }

  const setIndex = (index, emitChange) => {
    index = adjustIndex(index) || 0

    const indexoffset = -index * itemHeight

    const trigger = () => {
      if (index !== currentIndex) {
        setCurrentIndex(index)
      }
    }
    if (moving.current && indexoffset !== offset) {
      transitionEndTrigger.current = trigger
    } else {
      trigger()
    }
    setOffset(indexoffset)
  }

  const stopMomentum = () => {
    moving.current = false
    setDuration(0)
    if (transitionEndTrigger.current) {
      transitionEndTrigger.current()
      transitionEndTrigger.current = null
    }
  }

  useEffect(() => {
    onChange(currentIndex, columns[currentIndex])
  }, [currentIndex, columns])

  useEffect(() => {
    if (currentIndex !== 0) {
      setOffset(-itemHeight * currentIndex)
    }
  }, [])

  const handleCancel = () => {
    onCancel()
  }

  useEffect(() => {
    if (visible) {
      window.document.body.style.overflow = 'hidden'
    } else {
      window.document.body.style.overflow = 'auto'
    }
    ;() => {
      window.document.body.style.overflow = 'auto'
    }
  }, [visible])

  return (
    <AtFloatLayout
      isOpened={visible}
      onClose={onClose}
      className={classNames('sp-component-picker', className)}
    >
      <View className='header'>
        <View className='left' onClick={handleCancel}>
          {onCancelText}
        </View>
        <View className='center'>{title}</View>
        <View
          className={classNames('right', {
            ['danger']: confirmType === 'danger'
          })}
          onClick={(e) => onConfirm(currentIndex, columns[currentIndex])}
        >
          {onConfirmText}
        </View>
      </View>
      <View className='content'>
        <View className='columns'>
          <View
            className='column'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <View
              className='column_wrapper'
              style={wrapperStyle}
              ref={wrapper}
              onTransitionend={stopMomentum}
            >
              {columns.map((c, index) => (
                <View
                  className={classNames('columns_item', {
                    ['selected']: index === currentIndex
                  })}
                  key={c}
                >
                  <Text className='text'>{c}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='frame'></View>
        </View>
      </View>
    </AtFloatLayout>
  )
}

export default React.memo(SpPicker)
