/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { AtToast } from 'taro-ui'
import { isObject } from '@/utils'
import './index.scss'

const tips = require('@/assets/imgs/tips.png')

function resolveState(props = {}, state = {}) {
  const ret = {
    ...props,
    ...state
  }

  return ret
}

export default class SpToast extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showToast: false,
      text: ''
    }

    Taro.eventCenter.on('sp-toast:show', this.handleShow)
    Taro.eventCenter.on('sp-toast:close', this.handleClose)
  }

  componentWillUnmount() {
    Taro.eventCenter.off('sp-toast:show', this.handleShow)
    Taro.eventCenter.off('sp-toast:close', this.handleClose)
  }

  handleShow = (text, config = {}) => {
    console.log('handleShow', text)
    if (typeof text === 'string') {
      config = {
        ...config,
        text
      }
    } else if (isObject(text)) {
      config = {
        ...config,
        ...text
      }
    }

    this.setState({
      showToast: true,
      ...config
    })
  }

  handleClose = () => {
    this.setState({
      showToast: false
    })
  }

  render() {
    const { showToast, text } = this.state
    let newText = ''
    if (text.length > 13) {
      newText = text.substring(0, 13) + '\n' + text.substring(13)
    } else {
      newText = text
    }
    const { icon, image = tips, status, duration, hasMask } = resolveState(this.props, this.state)

    return (
      <AtToast
        icon={icon}
        image={image}
        status={status}
        duration={duration}
        hasMask={hasMask}
        isOpened={showToast}
        onClose={this.handleClose}
        text={newText}
        className='customToast'
      />
    )
  }
}
