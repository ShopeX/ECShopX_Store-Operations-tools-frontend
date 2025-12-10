/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { createReducer } from 'redux-create-reducer'

const initState = {
  activeShop: {
    test: 100
  },
  status: 200
}

const planSelection = createReducer(initState, {
  ['planSelection/activeShop'](state, { payload }) {
    console.log(state, payload)
    return {
      ...state,
      activeShop: payload
    }
  }
})

export default planSelection
