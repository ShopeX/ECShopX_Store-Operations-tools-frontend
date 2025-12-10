/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

//平铺数组
function flattenArray(arr) {
  let result = []
  function transform(arr) {
    arr.forEach((item) => {
      result.push(item)
      if (item.children) {
        transform(item.children)
      }
    })
  }
  transform(arr)
  return result
}

function findById(arr, id) {
  const flattened = flattenArray(arr)
  if (!id) {
    return arr
  }
  return flattened.find((item) => item.id === id)?.children
}

export { flattenArray, findById }
