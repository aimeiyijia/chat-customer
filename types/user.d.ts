declare type LoginParams = {
  username: string | number
  password: string
  role: string
  loginType: string
}

interface User {
  chatUserId: string
  username: string
  password?: string
  avatar: string
  role?: string
  tag?: string
  platform?: string
  createTime: number
}

declare module "js-cookie"
