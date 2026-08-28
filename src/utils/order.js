/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

function parseDiscountInfo(discountInfo) {
  if (!discountInfo || discountInfo === '0') return []
  if (Array.isArray(discountInfo)) return discountInfo
  let parsed = discountInfo
  if (typeof discountInfo === 'string') {
    try {
      parsed = JSON.parse(discountInfo)
    } catch (e) {
      return []
    }
  }
  // 订单改价等场景可能是对象 {"mark_down":{...}}，统一转成数组
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') return Object.values(parsed)
  return []
}

function hasPaidCouponItem(discountInfo) {
  return parseDiscountInfo(discountInfo).some((item) => item.type === 'paid_coupon_item')
}

/** 商品为优惠券的订单（付费券兑换等） */
export function isCouponOrder(order) {
  if (!order) return false

  if (Array.isArray(order.coupon_details) && order.coupon_details.length > 0) {
    return true
  }

  if (hasPaidCouponItem(order.discount_info)) {
    return true
  }

  const items = order.items || []
  return items.some((item) => hasPaidCouponItem(item.discount_info))
}

/** 付费券订单：隐藏发货按钮，已付款时取消订单改为申请退款 */
export function normalizeCouponOrderInfo(order) {
  if (!isCouponOrder(order)) return order

  const appInfo = { ...order.app_info }
  const payStatus = order.pay_status || order.order_status
  const isPaid = payStatus === 'PAYED'

  if (Array.isArray(appInfo.buttons)) {
    appInfo.buttons = appInfo.buttons
      .filter((btn) => btn.type !== 'delivery')
      .map((btn) => (btn.type === 'cancel' && isPaid ? { ...btn, name: '申请退款' } : btn))
  }

  return { ...order, app_info: appInfo }
}

/** 解析券核销扫码内容 */
export function parseCouponConsumeParams(raw = '') {
  let value = String(raw).trim()

  if (value.startsWith('{')) {
    try {
      const data = JSON.parse(value)
      return {
        code: data.code,
        order_id: data.order_id
      }
    } catch (e) {
      return {}
    }
  }

  const excodePrefix = 'excode:'

  if (value.indexOf(excodePrefix) === 0) {
    value = value.slice(excodePrefix.length)
  }

  value = value.replace(/^ZT_/, '')

  const dashIndex = value.indexOf('-')
  if (dashIndex > 0) {
    const userId = value.slice(0, dashIndex)
    const code = value.slice(dashIndex + 1)
    if (/^\d+$/.test(userId) && code) {
      return { code }
    }
  }

  return { code: value }
}
