/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis
  if (password.length === 0) {
    console.error("请输入密码")
    return false
  }
  if (!passwordReg.test(password)) {
    console.error("密码只含有字母、数字和下划线")
    return false
  }
  if (password.length > 9) {
    console.error("密码太长")
    return false
  }
  return true
}

export const phoneReg = /^1\d{10}$/

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0 // Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// 获取到文件类型
export const getFileType = (file: { fileName: string }) => {
  if (file && file.fileName) {
    const lastPointeIndex = file.fileName.lastIndexOf(".")
    const len = file.fileName.length
    const name = file.fileName.substring(0, lastPointeIndex)
    const type = file.fileName.substring(lastPointeIndex + 1, len)
    return {
      name,
      type,
    }
  }
  return ""
}

// 获取指定范围内的随机数
function randomAccess(min: number, max: number) {
  return Math.floor(Math.random() * (min - max) + max)
}

// 解码
function decodeUnicode(str: string) {
  return decodeURIComponent(JSON.parse(`"\\u${str}"`))
}

export function getRandomName(NameLength: number) {
  let name = ""
  for (let i = 0; i < NameLength; i++) {
    let unicodeNum = ""
    unicodeNum = randomAccess(0x4e00, 0x9fa5).toString(16)
    name += decodeUnicode(unicodeNum)
  }
  return name
}
