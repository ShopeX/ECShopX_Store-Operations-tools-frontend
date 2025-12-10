/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { API } from './req'

const req = new API({
  baseURL: process.env.APP_BASE_URL + '/h5app/wxapp/',
  isWeapp: true
})

export function storemanagerinfo(params) {
  return req.get('/salespersonadmin/storemanagerinfo', params)
}
