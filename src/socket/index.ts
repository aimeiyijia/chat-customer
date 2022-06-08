import io from 'socket.io-client'
import { useUserStore } from "@/store/index"
import { EventEmitter } from 'events'
class SocketIO {
  // private socket: SocketIOClient.Socket
  public _event: any
  public static instance: SocketIO
  constructor() {
    this._event = new EventEmitter()
  }

  connectSocket() {
    const UserStore = useUserStore()
    const { userId } = UserStore.user.userInfo
    const socket: SocketIOClient.Socket = io(`/?userId=${userId}`, {
      transports: ['websocket'],
      reconnection: false,
    })
    socket.on('connect', () => {
      console.log('连接成功')
      this._event.emit('connect')
    })
    socket.on('connect_error', (error: Error) => {
      console.error('连接失败', error)
      this._event.emit('connect_error')
    })
    socket.on('connect_timeout', (error: Error) => {
      console.error('连接超时', error)
    })
    socket.on('reconnect', (error: Error) => {
      console.error('成功重新连接', error)
      this._event.emit('reconnect')
    })
    socket.on('reconnect_attempt', (error: Error) => {
      console.error('试图重连', error)
    })
    socket.on('reconnecting', (error: Error) => {
      console.error('正在重连', error)
    })
    return socket
  }

  static getInstance() {
    if (this.instance) return this.instance
    const instance = new SocketIO()
    return instance
  }
}

export default SocketIO.getInstance()
