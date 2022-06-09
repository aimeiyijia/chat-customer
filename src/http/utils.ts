import to from "await-to-js"
import { AxiosResponse } from "axios"

// 处理所有后端返回的数据
export async function processReturn(reqFn: any): Promise<any> {
  const [err, res] = await to<AxiosResponse>(reqFn)
  const { code, msg, data } = res!.data
  console.log(res)
  if (code) {
    console.log("登录失败")
    return
  }
  if (msg) {
    console.log("登录成功")
  }
  if (err) {
    console.log(err, "接口请求出错")
  }
  return data
}
