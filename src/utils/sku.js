/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export function expandSpecs(obj) {
  let idArrays = Object.values(obj).reduce((total, ids) => total.concat(ids), [])
  return idArrays.map((_item) => _item.split('-')[0])
}
