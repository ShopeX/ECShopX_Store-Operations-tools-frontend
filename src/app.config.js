/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export default {
  pages: [
    'pages/index',
    'pages/message/index',
    'pages/messageDetail/index',
    'pages/my/index',
    'pages/auth/login',
    'pages/auth/index',
    'pages/order/list', //订单列表
    'pages/order/detail', //订单详情
    'pages/order/delivery', //订单发货
    'pages/afterSales/list', //售后订单
    'pages/afterSales/detail', //售后详情
    'pages/afterSales/deal', //处理售后
    'pages/auth/agreement',
    'pages/auth/bindPhone',
    'pages/auth/bindPhoneStepTwo',
    'pages/planSelection/index',
    'pages/logisticsInfo/index',
    'pages/address/index',
    'pages/address/addAddress/index',
    'pages/landing/index',
    'pages/weapp/login', //微信登陆页
    'pages/good/list', //商品列表
    'pages/good/form', //商品编辑
    'pages/order/ziti-list' //自提列表
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index',
        iconPath: './assets/imgs/index/index.svg',
        selectedIconPath: './assets/imgs/index/indexHover.svg',
        text: '店铺'
      },
      {
        pagePath: 'pages/message/index',
        iconPath: './assets/imgs/index/message.svg',
        selectedIconPath: './assets/imgs/index/messageHover.svg',
        text: '消息'
      },
      {
        pagePath: 'pages/my/index',
        iconPath: './assets/imgs/index/myinfo.svg',
        selectedIconPath: './assets/imgs/index/myinfoHover.svg',
        text: '我的信息'
      }
    ],
    selectedColor: '#4980FF',
    backgroundColor: '#FFF'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f5f5f5',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
