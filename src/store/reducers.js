/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { combineReducers } from 'redux'
import user from './user'
import planSelection from './planSelection'

export default combineReducers({
  user,
  planSelection
})
