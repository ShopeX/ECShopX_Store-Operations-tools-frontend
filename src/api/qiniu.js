/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

export function uploadQiniuPic(query) {
  return req.post('espier/image', query)
}
