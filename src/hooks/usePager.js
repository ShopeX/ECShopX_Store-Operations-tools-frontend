/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

// fetch 方法需要返回条数总量: { total }，用来计算页数
// page 存放page相关的状态
// import { Tracker } from "@/service";
import React from 'react'
import useStateCallback from './useStateCallback'

export default function usePaper(props) {
  const { pageSize = 10, pageNo = 0, pageTotal = 0, fetch } = props

  const [page, setPage] = useStateCallback({
    total: pageTotal,
    page_no: pageNo,
    page_size: pageSize,
    isLoading: false,
    hasNext: true
  })

  const nextPage = async () => {
    if (!page.hasNext || page.loading) return

    //上拉触底
    if (page.page_no > 0) {
    }

    page.isLoading = true

    setPage(page)

    const { page_no, page_size } = page
    const curPage = page_no + 1

    const { total: fetchTotal } = await fetch({
      page_no: curPage,
      page_size
    })

    if (!fetchTotal || curPage >= Math.ceil(+fetchTotal / page_size)) {
      page.hasNext = false
    }

    setPage({
      ...page,
      total: fetchTotal,
      page_no: curPage,
      isLoading: false
    })
  }

  const resetPage = (cb = () => {}) => {
    const resetPageParams = {
      ...(page || {}),
      page_no: 0,
      total: 0,
      isLoading: false,
      hasNext: true
    }
    setPage(resetPageParams, cb)
  }

  return {
    nextPage,
    resetPage
  }
}
