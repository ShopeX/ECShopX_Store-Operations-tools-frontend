/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import req from './req'

//获取店铺列表
export function getShopList(params) {
  console.log(params)
  return req.get('/distributors', params)
}
