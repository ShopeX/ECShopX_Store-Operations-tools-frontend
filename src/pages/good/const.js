/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

//主类目
export const MAIN_CATEGORY = 'main_category'

//标题
export const TITLE = 'title'

//副标题
export const SUB_TITLE = 'sub_title'

//分类
export const CATEGORY = 'category'

//商品排序
export const SORT = 'sort'

//是否为赠品
export const ISGIFT = 'is_gift'

//品牌
export const BRAND = 'brand'

//计量单位
export const ITEMUNIT = 'item_unit'

//产地
export const DISTRICT = 'district'

//运费模版
export const TEMPLATE = 'template'

//多规格
export const SPECS = 'specs'

//参数
export const PARAMS = 'params'

export const ITEM_SPECS = 'item_specs'

//商品图片
export const PIC = 'pic'

export const DETAIL = 'detail'

//商品状态
export const STATUS = 'status'

//商品库存
export const STORE = 'store'
//商品销售价
export const SALE_PRICE = 'sale_price'

//商品成本价
export const COSTPRICE = 'cost_price'

//商品市场价
export const MARKETPRICE = 'market_price'

//商品条形码
export const BARCODE = 'barcode'

//重量
export const WEIGHT = 'weight'

//体积
export const VOLUME = 'volume'

export const ITEM_BN = 'item_bn'

export const SHOW_SEPC = 'show_spec'

export const CAT_MAP = {
  category_name: 'label',
  category_id: 'id'
}

export const BRAND_MAP = {
  attribute_id: 'id',
  attribute_name: 'label'
}

export const TEMPLATE_MAP = {
  template_id: 'id',
  name: 'label'
}

export const STATUS_LIST = [
  { value: 'onsale', label: '前台可销售' },
  { value: 'offline_sale', label: '可线下销售' },
  { value: 'only_show', label: '前台仅展示' },
  { value: 'instock', label: '不可销售' }
]

export const REQUIRE_VALUE = {
  approve_status: '',
  store: '',
  item_bn: '',
  price: '',
  cost_price: '',
  market_price: '',
  barcode: '',
  point_num: 0,
  weight: '',
  volume: ''
}
