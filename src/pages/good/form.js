/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

import React, { useEffect } from 'react'
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpMultilevelPicker, SpPicker, SpToast } from '@/components'
import { CommonButton } from '@/components/sp-page-components'
import { getThemeStyle, transformData, showToast, requestCallback, classNames } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import { useSelector } from 'react-redux'
import { transformDetail } from './util'
import { FormItem, SpecItem, FormImageItem, ParamsItem } from './comps'
import district from '@/common/district.json'
import {
  STATUS_LIST,
  REQUIRE_VALUE,
  MAIN_CATEGORY,
  TITLE,
  SUB_TITLE,
  DETAIL,
  PIC,
  SPECS,
  CATEGORY,
  BRAND,
  TEMPLATE,
  CAT_MAP,
  BRAND_MAP,
  TEMPLATE_MAP,
  ITEM_SPECS,
  SORT,
  ITEMUNIT,
  DISTRICT,
  ISGIFT,
  PARAMS
} from './const'

import './form.scss'

const initState = {
  mainCategoryVisible: false,
  mainCategory: {},
  categoryVisible: false,
  category: {},
  brandVisible: false,
  brand: {},
  template: {},
  templateVisible: false,
  item_name: '',
  brief: '',
  //已选择的规格
  selectSpec: [],
  //是否开启多规格
  openSpec: false,
  //图片
  pics: [],
  detail: [],
  custom_item_spec_desc: {},
  id: undefined,
  //新加没修改的参数
  item_source: '',
  item_unit: '',
  sort: '',
  regions_id: null,
  districtVisible: false,
  tax_rate: '',
  is_gift: '',
  giftVisible: false,
  pics_create_qrcode: [], //[false]
  videos: '',
  is_show_specimg: undefined,
  item_params: [], //！
  tdk_content: '',
  spec_images: [], //看是否是多规格才有，数组接口传的时候看上面的数组怎么传每一项
  item_id: ''
}

const initData = {
  mainCategoryList: [],
  categoryList: [],
  brandList: [],
  templateList: [],
  goodsSpec: [],
  giftList: [
    { id: true, label: '是' },
    { id: false, label: '否' }
  ],
  paramsData: []
}

const Detail = () => {
  const [state, setState] = useImmer(initState)

  const [fetchData, setFetchData] = useImmer(initData)

  const {
    mainCategoryList,
    categoryList,
    brandList,
    templateList,
    goodsSpec,
    giftList,
    paramsData
  } = fetchData

  const {
    mainCategoryVisible,
    mainCategory,
    categoryVisible,
    category,
    brandVisible,
    brand,
    templateVisible,
    template,
    item_name,
    brief,
    selectSpec,
    openSpec,
    pics,
    detail,
    id,
    item_source,
    item_unit,
    sort,
    regions_id,
    districtVisible,
    tax_rate,
    is_gift,
    giftVisible,
    pics_create_qrcode,
    videos,
    is_show_specimg,
    tdk_content,
    item_params,
    spec_images,
    item_id
  } = state

  useDidShow(async () => {
    const {
      params: { id }
    } = getCurrentInstance().router
    // item_category_main_name:({item_category_main})=>item_category_main[0]?.children?.[0]?.children?.[0].category_name,
    // item_category_main_id:({item_category_main})=>item_category_main[0]?.children?.[0]?.children?.[0].id
    if (!id) return
    setState((_val) => {
      _val.id = id
    })
    const {
      item_category_main,
      item_name,
      brief,
      item_category_info,
      goods_brand,
      brand_id,
      nospec,
      templates_name,
      templates_id,
      pics,
      custom_item_spec_desc,
      spec_items,
      intro,
      price = 0,
      cost_price = 0,
      approve_status,
      store,
      item_bn,
      //未修改的值
      item_source,
      item_unit,
      sort,
      regions_id,
      tax_rate,
      is_gift,
      pics_create_qrcode, //[false]
      videos,
      is_show_specimg,
      tdk_content,
      item_params,
      item_params_list,
      spec_images,
      item_id
    } = await api.weapp.good_detail(id)

    getGoodsParams(item_params_list, item_params)
    const isMulti = nospec === false
    await setState((_val) => {
      _val.mainCategory = {
        id: item_category_main[0]?.children?.[0]?.children?.[0].category_id,
        label: item_category_main[0]?.children?.[0]?.children?.[0].category_name
      }
      _val.item_name = item_name
      _val.brief = brief
      _val.category = {
        id: item_category_info[0]?.children?.[0]?.category_id,
        label: item_category_info[0]?.children?.[0]?.category_name
      }
      _val.brand = {
        id: brand_id,
        label: goods_brand
      }
      _val.item_bn = item_bn
      _val.price = price / 100
      _val.template = {
        label: templates_name,
        id: templates_id
      }
      _val.openSpec = isMulti
      _val.pics = pics
      _val.custom_item_spec_desc = custom_item_spec_desc
      _val.selectSpec = isMulti
        ? spec_items.map((item) => ({
            ...item,
            price: item.price / 100,
            cost_price: item.cost_price / 100,
            approve_status: {
              label: STATUS_LIST.find((_item) => _item.value === item.approve_status)?.label,
              value: item.approve_status
            },
            sku_id: item.custom_spec_id,
            sku_name: item.custom_spec_name
          }))
        : [
            {
              approve_status: {
                label: STATUS_LIST.find((_item) => _item.value === approve_status)?.label,
                value: approve_status
              },
              store,
              price: price / 100,
              cost_price: cost_price / 100,
              item_bn: item_bn
            }
          ]
      _val.detail = intro
        .replace(/<img[^>]*src=['"]([^'"]+)[^>]*>/, (...args) => `${args[1]}==`)
        .split('==')
        .filter((item) => !!item)
      ;(_val.item_source = item_source),
        (_val.item_unit = item_unit),
        (_val.sort = sort),
        (_val.regions_id = regions_id),
        (_val.tax_rate = tax_rate),
        (_val.is_gift = is_gift),
        (_val.pics_create_qrcode = pics_create_qrcode), //[false]
        (_val.videos = videos),
        (_val.is_show_specimg = is_show_specimg),
        (_val.tdk_content = tdk_content),
        (_val.item_params = item_params),
        (_val.spec_images = spec_images),
        (_val.item_id = item_id)
    })
  })

  const {
    activeShop: { distributor_id }
  } = useSelector((state) => state.planSelection)

  const getMainCategory = async () => {
    const category_data = await api.weapp.main_category()

    await setFetchData((_val) => {
      _val.mainCategoryList = transformData(category_data, CAT_MAP)
    })
  }

  const getCategory = async () => {
    const category_data = await api.weapp.category({
      distributor_id
    })

    await setFetchData((_val) => {
      _val.categoryList = transformData(category_data, CAT_MAP)
    })
  }

  const getBrand = async () => {
    const { list } = await api.weapp.brand()
    await setFetchData((_val) => {
      _val.brandList = transformData(list, BRAND_MAP)
    })
  }

  const getTemplate = async () => {
    const { list } = await api.weapp.template()
    await setFetchData((_val) => {
      _val.templateList = transformData(list, TEMPLATE_MAP)
    })
  }

  const getMainCategoryDetail = async (id) => {
    const { goods_spec, goods_params } = await api.weapp.main_category_detail(id)

    await setFetchData((_val) => {
      _val.goodsSpec = goods_spec
    })
    await getGoodsParams(goods_params, [])
  }

  // 商品参数
  const getGoodsParams = async (list, value) => {
    const paramsDatac = []
    list.forEach((item) => {
      const temp = {
        value: item.attribute_id,
        label: item.attribute_name,
        attribute_value_id: '',
        attribute_value_name: '',
        children: []
      }
      item.attribute_values.list.forEach(({ attribute_value_id, attribute_value }) => {
        temp.children.push({
          value: attribute_value_id,
          label: attribute_value
        })
      })
      const fd = value.find((sitem) => sitem.attribute_id == item.attribute_id)
      if (fd) {
        temp.attribute_value_id = fd.attribute_value_id
        temp.attribute_value_name = fd.attribute_value_name
      }
      paramsDatac.push(temp)
    })

    await setFetchData((_val) => {
      _val.paramsData = paramsDatac
    })
  }

  useEffect(() => {
    getMainCategory()
    getCategory()
    getBrand()
    getTemplate()
  }, [])

  const handleClickFormItem = (key) => (item) => {
    switch (key) {
      case MAIN_CATEGORY:
        if (id) {
          showToast('商品主类目暂不支持修改！')
          break
        }

        setState((val) => {
          val.mainCategoryVisible = true
        })
        break
      case CATEGORY:
        if (categoryList.length == 0) {
          showToast('请在PC管理端添加分类！')
          break
        }
        setState((val) => {
          val.categoryVisible = true
        })
        break
      case BRAND:
        if (brandList.length == 0) {
          showToast('请在PC管理端添加品牌！')
          break
        }
        setState((val) => {
          val.brandVisible = true
        })
        break
      case TEMPLATE:
        if (templateList.length == 0) {
          showToast('请在PC管理端添加运费模板！')
          break
        }
        setState((val) => {
          val.templateVisible = true
        })
        break

      case DISTRICT:
        setState((val) => {
          val.districtVisible = true
        })
        break
      case ISGIFT:
        setState((val) => {
          val.giftVisible = true
        })
        break
    }
  }

  const handleChangeForm = (key) => (item, fullItem) => {
    console.log('===handleChangeForm==', item, fullItem)
    switch (key) {
      case MAIN_CATEGORY:
        setState((_val) => {
          _val.mainCategory = item
          _val.mainCategoryVisible = false
        })
        setFetchData((val) => {
          val.paramsData = []
        })
        break
      case CATEGORY:
        setState((_val) => {
          _val.category = item
          _val.categoryVisible = false
        })
        break
      case TITLE:
        setState((_val) => {
          _val.item_name = item
        })
        break
      case SUB_TITLE:
        setState((_val) => {
          _val.brief = item
        })
        break
      case BRAND:
        setState((_val) => {
          _val.brand = brandList[item]
          _val.brandVisible = false
        })
        break
      case TEMPLATE:
        setState((_val) => {
          _val.template = templateList[item]
          _val.templateVisible = false
        })
        break
      case SPECS:
        setState((_val) => {
          _val.openSpec = item
        })
        break
      case PIC:
        setState((val) => {
          val.pics = [...item]
        })
        break
      case DETAIL:
        setState((val) => {
          val.detail = [...item]
        })
        break
      case ITEM_SPECS:
        setState((val) => {
          val.selectSpec = [...item]
        })
        break

      case ITEMUNIT:
        setState((val) => {
          val.item_unit = item
        })
        break
      case SORT:
        setState((val) => {
          val.sort = item
        })
        break
      case DISTRICT:
        let selectAreaId = []
        fullItem.forEach((aItem) => {
          selectAreaId.push(aItem.id)
        })
        setState((_val) => {
          _val.regions_id = selectAreaId
          _val.districtVisible = false
        })
        break
      case ISGIFT:
        let is_giftn = giftList[item].id
        setState((val) => {
          val.is_gift = is_giftn
          val.giftVisible = false
        })
        break
      case PARAMS:
        setFetchData((val) => {
          val.paramsData = [...item]
        })
        break
    }
  }

  useEffect(() => {
    if (mainCategory.id) {
      getMainCategoryDetail(mainCategory.id)
    }
  }, [mainCategory])

  //是否有多规格
  const hasGoodSpec = goodsSpec.length > 0

  const handleSubmit = async () => {
    console.log('==handleSubmit=')

    if (!mainCategory.id) {
      showToast('商品主类目必填')
      return
    }
    if (!item_name) {
      showToast('商品标题必填')
      return
    }
    if (!category.id) {
      showToast('商品分类必填')
      return
    }
    if (!brand.id) {
      showToast('商品品牌必填')
      return
    }
    if (!template.id) {
      showToast('商品运费模版必选')
      return
    }
    let currentSpecs = {}
    console.log('==', selectSpec)
    if (openSpec) {
      const isFull = selectSpec.every(
        (spec) => spec.approve_status.value && spec.price && spec.store
      )
      if (!isFull) {
        showToast('规格信息需填写完整！')
        return
      }
    } else {
      currentSpecs = { ...selectSpec[0] }
      if (!currentSpecs.approve_status.label) {
        showToast('商品售卖状态必选')
        return
      }
      if (!currentSpecs.store) {
        showToast('商品库存必填')
        return
      }
      if (!currentSpecs.price) {
        showToast('商品价格必填')
        return
      }
      currentSpecs.approve_status = currentSpecs.approve_status.value
    }
    if (pics.length === 0) {
      showToast('商品图片必填')
      return
    }
    requestCallback(
      async () => {
        let data = {}
        if (id) {
          data = await api.weapp.edit_good({
            ...(openSpec ? {} : REQUIRE_VALUE),
            id,
            distributor_id,
            item_type: 'normal',
            special_type: 'normal',
            item_name,
            item_main_cat_id: mainCategory.id,
            brief,
            item_category: [category.id],
            brand_id: brand.id,
            templates_id: template.id,
            pics,
            intro: transformDetail(detail),
            spec_items: openSpec
              ? JSON.stringify(
                  selectSpec.map((item) => ({
                    ...REQUIRE_VALUE,
                    ...item,
                    approve_status: item.approve_status.value
                  }))
                )
              : undefined,
            nospec: openSpec ? false : true,
            item_source,
            item_unit,
            sort,
            regions_id,
            tax_rate,
            is_gift,
            pics_create_qrcode,
            videos,
            is_show_specimg,
            tdk_content,
            item_params: paramsData.map((item) => {
              return {
                attribute_id: item.value,
                attribute_value_id: item.attribute_value_id,
                attribute_value_name: item.attribute_value_name
              }
            }),
            spec_images: JSON.stringify(spec_images),
            item_id,
            ...currentSpecs
          })
        } else {
          data = await api.weapp.good({
            ...(openSpec ? REQUIRE_VALUE : REQUIRE_VALUE),
            distributor_id,
            sort: 1,
            item_type: 'normal',
            special_type: 'normal',
            item_name,
            item_main_cat_id: mainCategory.id,
            brief,
            item_category: [category.id],
            brand_id: brand.id,
            templates_id: template.id,
            pics,
            intro: transformDetail(detail),
            spec_items: openSpec
              ? JSON.stringify(
                  selectSpec.map((item) => ({
                    ...REQUIRE_VALUE,
                    ...item,
                    approve_status: item.approve_status.value
                  }))
                )
              : undefined,
            nospec: openSpec ? false : true,
            item_source,
            item_unit,
            sort: 1,
            regions_id,
            tax_rate,
            is_gift,
            pics_create_qrcode,
            videos,
            is_show_specimg,
            tdk_content,
            item_params: paramsData.map((item) => {
              return {
                attribute_id: item.value,
                attribute_value_id: item.attribute_value_id,
                attribute_value_name: item.attribute_value_name
              }
            }),
            spec_images: JSON.stringify(spec_images),
            item_id,
            ...currentSpecs
          })
        }
        return data
      },
      id ? '编辑商品成功' : '添加商品成功',
      () => {
        setTimeout(() => {
          Taro.navigateBack()
        }, 100)
      }
    )
  }

  const idToLabel = (dateArr, selectArr) => {
    if (!selectArr) return ''
    let labelArr = []
    const _handleData = (sourceData) => {
      sourceData.forEach((item) => {
        if (selectArr.includes(item.id)) {
          labelArr.push(item.label)
          if (item.children) {
            _handleData(item.children)
          }
        }
      })
    }
    _handleData(dateArr)
    return labelArr.join('/')
  }

  return (
    <View
      className={classNames('page-good-detail', { 'page-good-detail-lock': brandVisible })}
      style={getThemeStyle()}
    >
      <View className='page-good-detail-scrolllist'>
        <View className='top-block'>
          <FormItem
            label='商品主类目'
            required
            mode='selector'
            placeholder='请选择商品主类目'
            onClick={handleClickFormItem(MAIN_CATEGORY)}
            value={mainCategory.label}
            editable={id ? false : undefined}
          />
          <FormItem
            label='商品标题'
            required
            mode='input'
            placeholder='请输入商品标题'
            onChange={handleChangeForm(TITLE)}
            value={item_name}
          />
          <FormItem
            label='商品副标题'
            mode='input'
            placeholder='请输入商品副标题'
            onChange={handleChangeForm(SUB_TITLE)}
            value={brief}
          />
          <FormItem
            label='运费模版'
            required
            mode='selector'
            placeholder='请选择运费模版'
            onClick={handleClickFormItem(TEMPLATE)}
            value={template.label}
          />
          <FormItem
            label='品牌'
            required
            mode='selector'
            placeholder='请选择品牌'
            onClick={handleClickFormItem(BRAND)}
            value={brand.label}
          />
          <FormItem
            label='计量单位'
            mode='input'
            placeholder='请输入计量单位'
            onChange={handleChangeForm(ITEMUNIT)}
            value={item_unit}
          />
          <FormItem
            label='排序编号'
            mode='input'
            placeholder='请输入排序编号'
            onChange={handleChangeForm(SORT)}
            value={sort}
          />
          <FormItem
            name={DISTRICT}
            label='产地'
            mode='selector'
            className='district'
            placeholder='请选择商品产地'
            onClick={handleClickFormItem(DISTRICT)}
            value={idToLabel(district, regions_id)}
          />
          <FormItem
            name={ISGIFT}
            label='赠品'
            mode='selector'
            placeholder='请选择是否为赠品'
            onClick={handleClickFormItem(ISGIFT)}
            value={is_gift + '' === '' ? '' : is_gift ? '是' : '否'}
          />
          <FormItem
            name={CATEGORY}
            label='商品分类'
            required
            className='category'
            mode='selector'
            placeholder='请选择商品分类'
            onClick={handleClickFormItem(CATEGORY)}
            value={category.label}
          />
        </View>

        {paramsData.length > 0 && (
          <ParamsItem paramsData={paramsData} onChange={handleChangeForm(PARAMS)} />
        )}

        <View className='title'>商品规格</View>
        {/* {hasGoodSpec && !id && ( */}
        <FormItem
          label='商品规格'
          mode='switch'
          placeholder='多规格'
          className='spec-switch'
          onChange={handleChangeForm(SPECS)}
          value={openSpec}
        />
        {/* )} */}

        <SpecItem
          goodsSpec={goodsSpec}
          openSpec={openSpec}
          onChange={handleChangeForm(ITEM_SPECS)}
          value={selectSpec}
          id={id}
        />

        <View className='bottom-block'>
          <FormImageItem
            label='商品图片'
            desc='(最多上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，建议尺寸：500*500px，不超过2M）'
            required
            placeholder='请选择商品图片'
            onChange={handleChangeForm(PIC)}
            value={pics}
          />
          <FormImageItem
            label='商品详情'
            desc='(文件格式为bmp、png、jpeg或jpg，建议尺寸：750*750px，不超过2M'
            placeholder='请选择商品详情'
            onChange={handleChangeForm(DETAIL)}
            value={detail}
          />
        </View>
      </View>
      <View className='page-good-detail-button'>
        <CommonButton text='提交' type='primary' onClick={handleSubmit} />
      </View>

      <SpMultilevelPicker
        visible={mainCategoryVisible}
        title='选择主类目'
        dataSource={mainCategoryList}
        onChange={handleChangeForm(MAIN_CATEGORY)}
        onClose={() =>
          setState((_val) => {
            _val.mainCategoryVisible = false
          })
        }
      />

      <SpMultilevelPicker
        visible={categoryVisible}
        title='选择分类'
        dataSource={categoryList}
        onChange={handleChangeForm(CATEGORY)}
        onClose={() =>
          setState((_val) => {
            _val.categoryVisible = false
          })
        }
      />

      <SpMultilevelPicker
        visible={districtVisible}
        title='选择地区'
        dataSource={district}
        onChange={handleChangeForm(DISTRICT)}
        onClose={() =>
          setState((_val) => {
            _val.districtVisible = false
          })
        }
      />

      <SpPicker
        visible={brandVisible}
        title='选择品牌'
        columns={brandList.map((item) => item.label)}
        onCancel={() =>
          setState((_val) => {
            _val.brandVisible = false
          })
        }
        onClose={() =>
          setState((_val) => {
            _val.brandVisible = false
          })
        }
        onConfirm={handleChangeForm(BRAND)}
      />

      <SpPicker
        visible={giftVisible}
        title='选择是否为赠品'
        columns={giftList.map((item) => item.label)}
        onCancel={() =>
          setState((_val) => {
            _val.giftVisible = false
          })
        }
        onClose={() =>
          setState((_val) => {
            _val.giftVisible = false
          })
        }
        onConfirm={handleChangeForm(ISGIFT)}
      />

      <SpPicker
        visible={templateVisible}
        title='选择运费模版'
        columns={templateList.map((item) => item.label)}
        onCancel={() =>
          setState((_val) => {
            _val.templateVisible = false
          })
        }
        onClose={() =>
          setState((_val) => {
            _val.templateVisible = false
          })
        }
        onConfirm={handleChangeForm(TEMPLATE)}
      />

      <SpToast />
    </View>
  )
}

export default Detail
