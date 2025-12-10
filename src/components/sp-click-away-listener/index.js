/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { PureComponent, Fragment } from 'react'
import ReactDOM from 'react-dom'

function ownerDocument(node) {
  return (node && node.ownerDocument) || document
}

function mapEventPropToEvent(eventProp) {
  return eventProp.substring(2).toLowerCase()
}

/**
 * 点击包裹组件其他地方进行操作
 */
export default class SpClickAwayListener extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { touchEvent = 'onTouchEnd' } = this.props
    const dom = ReactDOM.findDOMNode(this)
    if (touchEvent !== false) {
      const mappedTouchEvent = mapEventPropToEvent(touchEvent)
      const doc = ownerDocument(dom)
      doc.addEventListener(mappedTouchEvent, this.handleClickAway)
    }
  }

  componentWillUnmount() {
    const { touchEvent = 'onTouchEnd' } = this.props
    const dom = ReactDOM.findDOMNode(this)
    if (touchEvent !== false) {
      const mappedTouchEvent = mapEventPropToEvent(touchEvent)
      const doc = ownerDocument(dom)
      doc.removeEventListener(mappedTouchEvent, this.handleClickAway)
    }
  }

  handleClickAway = (event) => {
    let insideDOM
    const { onClickAway = () => {} } = this.props
    const dom = ReactDOM.findDOMNode(this)
    const doc = ownerDocument(dom)
    if (event.composedPath) {
      insideDOM = event.composedPath().indexOf(dom) > -1
    } else {
      insideDOM = doc.documentElement.contains(event.target) || dom.contains(event.target)
    }
    if (!insideDOM) {
      onClickAway(event)
    }
  }

  render() {
    const { children } = this.props

    return <Fragment>{React.cloneElement(children)}</Fragment>
  }
}
