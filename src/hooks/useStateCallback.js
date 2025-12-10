/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { useState, useEffect, useRef } from 'react'
//更新完state以后的回调
//与setState({a:2},()=>{})等价
export default function useStateCallback(initial) {
  const [state, setState] = useState(initial)

  const asyncCallback = useRef()

  const setStateWrapper = (nextState, next, prev) => {
    if (typeof prev === 'function') {
      //prevState
      if (prev(state, nextState) === false) {
        return
      }
    }

    asyncCallback.current = typeof next === 'function' ? next : null

    setState(nextState)
  }

  useEffect(() => {
    if (asyncCallback.current) asyncCallback.current(state)
  }, [state])

  return [state, setStateWrapper]
}
