/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import { default as SAPP } from './Mapp'
import { default as SAPPPay } from './MappPay'
import { default as SAPPShare } from './MappShare'
import './index.scss'

window.SAPP = SAPP

export { SAPP, SAPPPay, SAPPShare }
