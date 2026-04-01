/**
 * H5 首次进入时，路由参数里的 company_id 可能尚未写入 storage，
 * 而 componentDidMount 里的 qwsdk.register 会早于 componentDidShow，导致 config 等接口缺少 companyId。
 *
 * 同步来源（按序尝试）：
 * 1. window.location 的 search / hash 内查询串（history / hash 路由）
 * 2. Taro getCurrentInstance().router.params（browser 模式下参数常在路由里）
 * 3. URL 中 token（JWT）payload 内的 company_id（query 被改写时兜底）
 */
import Taro, { getCurrentInstance } from '@tarojs/taro'

export function getCompanyIdFromUrl() {
  if (typeof window === 'undefined') return ''
  try {
    const { search, hash } = window.location
    const fromSearch = new URLSearchParams(search || '')
    let id = fromSearch.get('company_id') || fromSearch.get('companyId') || ''

    // hash 形如 #/pages/index?company_id=xx 或 #/?company_id=xx
    if (!id && hash) {
      const qInHash = hash.indexOf('?')
      if (qInHash >= 0) {
        const hp = new URLSearchParams(hash.slice(qInHash + 1))
        id = hp.get('company_id') || hp.get('companyId') || ''
      }
    }

    return id || ''
  } catch (e) {
    return ''
  }
}

/** 从当前页路由取 company_id（Taro H5 browser 模式常用） */
export function getCompanyIdFromRouter() {
  try {
    const router = getCurrentInstance()?.router
    const p = router?.params || {}
    const id = p.company_id || p.companyId
    return id != null && id !== '' ? String(id) : ''
  } catch (e) {
    return ''
  }
}

/** 解析 JWT payload（仅解码，不校验签名），读 company_id */
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64
    return JSON.parse(atob(padded))
  } catch (e) {
    return null
  }
}

/** 入口 URL 形如 ?token=eyJ...&company_id=38 时，有时 company_id 未进路由参数，可从 JWT claims 取 */
export function getCompanyIdFromJwtInSearch() {
  if (typeof window === 'undefined') return ''
  try {
    const token = new URLSearchParams(window.location.search || '').get('token')
    if (!token) return ''
    const payload = decodeJwtPayload(token.trim())
    if (!payload) return ''
    const id = payload.company_id ?? payload.companyId
    return id != null && id !== '' ? String(id) : ''
  } catch (e) {
    return ''
  }
}

export function syncCompanyIdFromUrl() {
  let id = getCompanyIdFromUrl()
  if (!id) {
    id = getCompanyIdFromRouter()
  }
  if (!id) {
    id = getCompanyIdFromJwtInSearch()
  }
  if (id) {
    Taro.setStorageSync('company_id', id)
  }
  return id
}
