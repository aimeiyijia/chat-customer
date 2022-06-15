import io from "socket.io-client"
// import cookie from "js-cookie"
import { EventEmitter } from "events"

import { store } from "@/store/store"
class SocketIO {
  public _event: any
  public _socket: any
  public static instance: SocketIO
  constructor() {
    this._event = new EventEmitter()
    this._socket = null
  }

  connectSocket() {
    if (this._socket) return this._socket

    const userStore = store.getState()
    console.log(userStore, "装填")
    const { userInfo } = userStore.user
    if (!userInfo) return
    const { chatUserId, role } = userInfo
    const socket: SocketIOClient.Socket = io(
      `/?chatUserId=${chatUserId}&role=${role}`,
      {
        transports: ["websocket"],
        reconnection: true,
      }
    )
    socket.on("connect", () => {
      console.log("连接成功")
      this._event.emit("connect")
    })
    socket.on("connect_error", (error: Error) => {
      console.error("连接失败", error)
      this._event.emit("connect_error")
    })
    socket.on("connect_timeout", (error: Error) => {
      console.error("连接超时", error)
    })
    socket.on("reconnect", (error: Error) => {
      console.error("成功重新连接", error)
      this._event.emit("reconnect")
    })
    socket.on("reconnect_attempt", (error: Error) => {
      console.error("试图重连", error)
    })
    socket.on("reconnecting", (error: Error) => {
      console.error("正在重连", error)
    })
    this._socket = socket
    return socket
  }

  static getInstance() {
    if (this.instance) return this.instance
    const instance = new SocketIO()
    return instance
  }
}

export default SocketIO.getInstance()
