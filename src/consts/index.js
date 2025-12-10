/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import * as afterSales from './afterSales'
import * as good from './good'

//订单列表主状态
export const ORDER_LIST_STATUS = {
  'all': '全部',
  'cancel': '已取消',
  'notpay': '待支付',
  'notship': '待发货',
  'shipping': '已发货',
  'finish': '已完成'
}

export const ZITI_ORDER_LIST_STATUS = {
  'all': '全部',
  'notpay': '待支付',
  'RECEIVEORDER': '已分配',
  'ziti': '待自提',
  'notship': '待发货',
  'cancel': '已取消',
  'finish': '已完成'
}

//订单列表搜索字段
export const ORDER_LIST_FIELDS = {
  'order_id': '订单号',
  'item_name': '商品名称',
  'mobile': '手机号码',
  'receiver_name': '收货人姓名',
  'self_delivery_staff': '配送员'
}
//订单筛选时间
export const ORDER_LIST_FILTER_TIME = {
  'all': '全部',
  'today': '今天',
  'yesterday': '昨天',
  'recently7': '近七天',
  'recently30': '近30天'
}

//订单筛选类型
export const ORDER_LIST_FILTER_CLASS = {
  'all': '全部订单',
  'groups': '团购订单',
  'seckill': '秒杀订单',
  'shopguide': '导购订单',
  'crossborder': '跨境订单',
  'bargain': '助力订单',
  'community': '社区订单',
  'normal': '普通订单',
  'excard': '兑换券订单'
}

//订单筛选配送方式
export const ORDER_LIST_RECEIPT_TYPE = {
  'logistics': '普通快递',
  'dada': '同城配',
  'ziti': '自提'
}

export const ORDER_LIST_FILTER_ITEM = {
  'orderTime': '下单时间',
  'orderClass': '订单类型',
  'receiptType': '配送类型'
}

export const ZITI_ORDER_LIST_FILTER_ITEM = {
  'orderTime': '下单时间'
}

export const ORDER_LIST_CANCEL_REASON = {
  1: '客户现在不想购买',
  2: '客户商品价格较贵',
  3: '客户价格波动',
  4: '客户商品缺货',
  5: '客户重复下单',
  6: '客户订单商品选择有误',
  7: '客户支付方式选择有误',
  8: '客户收货信息填写有误',
  9: '客户发票信息填写有误',
  10: '客户无法支付订单',
  11: '客户长时间未付款',
  12: '客户其他原因'
}

export const ORDER_DETAIL_ICON = {
  'success_1': 'icon-yiwancheng-01',
  'success_2': 'icon-weitoutuo-01',
  'delivery_1': 'icon-daifahuo-01',
  'delivery_2': 'icon-qishoupeisong-011',
  'payed_1': 'icon-daifahuo-011',
  'payed_2': 'icon-qishouquxiao-01',
  'payed_3': 'icon-dengqishoujiedan-01',
  'payed_4': 'icon-jianhuo-01',
  'payed_5': 'icon-zhengzaiquhuo-01',
  'payed_6': 'icon-daiziti-01',
  'not_pay': 'icon-daifukuan-01',
  'cancel': 'icon-quxiaodingdan-01'
}

export const SELFDELIVERYSTATUSLIST = [
  // { label: '等待确认', value: 'CONFIRMING' },
  // { label: '已接单', value: 'RECEIVEORDER' },
  // { label: '已打包', value: 'PACKAGED' },
  { label: '配送中', value: 'DELIVERING' }
  // { label: '已送达', value: 'DONE' },
  // { label: '不是自配送', value: 'NOTMERCHANT' }
]

export const UPDATESELFDELIVERYSTATUSLIST = [
  // { label: '等待确认', value: 'CONFIRMING' },
  // { label: '已接单', value: 'RECEIVEORDER' },
  // { label: '已打包', value: 'PACKAGED' },
  // { label: '配送中', value: 'DELIVERING' },
  { label: '已送达', value: 'DONE' },
  { label: '已取消', value: 'CONFIRMING' } //先改成等待确认状态
  // { label: '不是自配送', value: 'NOTMERCHANT' }
]

export const ALLSELFDELIVERYSTATUSLIST = [
  { label: '等待确认', value: 'CONFIRMING' },
  { label: '已接单', value: 'RECEIVEORDER' },
  { label: '已打包', value: 'PACKAGED' },
  { label: '配送中', value: 'DELIVERING' },
  { label: '已送达', value: 'DONE' },
  { label: '不是自配送', value: 'NOTMERCHANT' }
]

export { afterSales, good }
