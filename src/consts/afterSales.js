/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

//订单列表
export const LIST_STATUS = {
  '0': '全部',
  '1': '待处理',
  '2': '处理中',
  '3': '已处理',
  '4': '已驳回',
  '5': '已关闭'
}

//订单列表搜索字段
export const LIST_FIELDS = {
  'aftersales_bn': '售后单号',
  'order_id': '订单号',
  'mobile': '手机号码'
}

export const FILTER_ITEM = {
  'createTime': '售后时间',
  'aftersalesType': '售后类型'
}

export const FILTER_TIME = {
  'all': '全部',
  'today': '今天',
  'yesterday': '昨天',
  'recently7': '近七天',
  'recently30': '近30天'
}

export const AFTERSALES_TYPE = {
  'all': '全部',
  'ONLY_REFUND': '仅退款',
  'REFUND_GOODS': '退货退款'
  // 'EXCHANGING_GOODS': '换货'
}

export const DETAIL_ICON = {
  0: 'icon-daichuli-01',
  1: 'icon-daijihui-01',
  2: 'icon-daiquerenshouhuo-01',
  3: 'icon-yibohui-01',
  4: 'icon-yichuli-01',
  5: 'icon-yibohui-01',
  6: 'icon-yichuli-01',
  7: 'icon-chehui-01',
  8: 'icon-daituikuan-01',
  9: 'icon-tuikuanzhong-01'
}
