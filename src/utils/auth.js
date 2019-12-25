import Cookies from 'js-cookie'
/**
 * 存储cookie
 */
export const setCookie = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  Cookies.set(name, content)
}

/**
 * 获取cookie
 */
export const getCookie = name => {
  if (!name) return
  return Cookies.get(name)
}

/**
 * 删除cookie
 */
export const removeCookie = name => {
  if (!name) return
  Cookies.remove(name)
}
