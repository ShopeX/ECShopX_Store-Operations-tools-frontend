/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { PureComponent } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

export default class NoteIndex extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  resolveUrl(img) {
    return require(`@/assets/imgs/${img}`)
  }

  render() {
    const { img, imgStyle, styles, className, imageType } = this.props

    return (
      <View
        className={classNames('note', img ? 'note__has-img' : null, className)}
        // style={styleNames(styles)}
      >
        {img && (
          <Image
            className='note__img'
            mode='aspectFit'
            // style={styleNames(imgStyle)}
            src={this.resolveUrl(img)}
          />
        )}
        <Text className='note__text'>{this.props.children}</Text>
      </View>
    )
  }
}
