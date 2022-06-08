// 所有好友的好友信息
interface FriendGather {
  [userId: string]: Customer
}

interface Customer {
  userId: string
  username: string
  avatar?: string
  role: string
  tag?: string
  messages: Message[] | any[]
  createTime?: number
  lastMessage?: Message | null
  unReadCount?: number
}

// 用户与好友关联表
interface UserMap {
  friendId: string
  userId: string
}

// 好友消息
interface Message {
  userId: string
  friendId: string
  content: string
  messageType: MessageType
  time: number
  position: string
  type?: string
  avatar: string, 
  username: string
}

interface SendMessage {
  type: string
  message: string | File
  width?: number
  height?: number
  messageType: MessageType[0] | MessageType[1]
}

// 消息类型
declare enum MessageType {
  text = "text",
  image = "image",
}

// 图片尺寸
interface ImageSize {
  width: number
  height: number
}

// 服务端返回值格式
interface ServerRes {
  code: number
  msg: string
  data: any
}

// 未读消息对象
interface UnReadGather {
  [key: string]: number
}

// 获取群分页消息参数
interface PagingParams {
  groupId?: string
  userId?: string
  friendId?: string
  current: number
  pageSize: number
}
