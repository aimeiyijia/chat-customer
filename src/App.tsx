import React, { useCallback, useEffect, useState } from "react"

import Chat, { Bubble, Modal, useMessages } from "@chatui/core"

import { useAppSelector, useAppDispatch } from "./store/hooks"
import {
  getToken,
  getUserInfo,
  getServerInfo,
  setServerInfo,
} from "./store/user"

import Socket from "@/socket"

import LoginModel from "./login"

const initialMessages = [
  {
    type: "system",
    content: {
      text: "智能助理进入对话，为您服务",
    },
  },
  {
    type: "text",
    content: { text: "您好，我是智能助理，你的贴心小助手~" },
    user: {
      avatar: "https://api.multiavatar.com/767febcc414a7722d2.svg",
    },
  },
]

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "债权人会议",
    isNew: true,
  },
  {
    name: "债权申报",
    isHighlight: true,
  },
  {
    name: "短语3",
  },
]

export default function () {
  const useDispatch = useAppDispatch()
  let userInfo = useAppSelector(getUserInfo)
  let serverInfo = useAppSelector(getServerInfo)
  const userToken = useAppSelector(getToken)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (userToken) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [userToken])
  useEffect(() => {
    if (userToken) {
      Socket.connectSocket()
      // 分配客服
      console.log(userInfo, "用户信息")
      Socket._socket.emit("AssignServer", userInfo)
      Socket._socket.on("AssignServer", (data: any) => {
        console.log(data, "分配客服成功")
        useDispatch(setServerInfo(data.data))
      })
      Socket._socket.on("CustomerMessage", (data: any) => {
        console.log(data, "消息")
        appendMsg({
          type: "text",
          content: { text: data.data.content },
          position: "right",
        })
      })
    }
  }, [userToken])
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages)

  // 发送回调
  function handleSend(type: string, val: any) {
    if (type === "text" && val.trim()) {
      // appendMsg({
      //   type: "text",
      //   content: { text: val },
      //   position: "right",
      // })

      // console.log(userInfo, "用户信息")
      // console.log(serverInfo, "客服信息")

      const userMessage = {
        chatUserId: userInfo!.chatUserId,
        chatUserFriendId: serverInfo!.chatUserId,
        sendRole: "customer",
        content: val,
        messageType: "text",
        sendTime: new Date().valueOf(),
        token: userToken,
      }
      console.log(userMessage, "哈哈哈")
      Socket._socket.emit("CustomerMessage", userMessage)

      setTyping(true)
    }
  }

  const handlePasteImg = useCallback((e: any) => {
    console.log(e, 123)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(null)
      }, 3000)
    })
  }, [])

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: any) {
    console.log(item, "快捷短语回调")
    handleSend("text", item.name)
  }

  function renderMessageContent(msg: any) {
    const { type, content } = msg
    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        )
      default:
        return null
    }
  }

  return open ? (
    <Modal active={open} showClose={false} backdrop="static">
      <LoginModel></LoginModel>
    </Modal>
  ) : (
    <Chat
      wideBreakpoint="600px"
      messages={messages}
      navbar={{
        leftContent: {
          icon: "chevron-left",
          title: "Back",
        },
        rightContent: [
          {
            icon: "apps",
            title: "Applications",
          },
          {
            icon: "ellipsis-h",
            title: "More",
          },
        ],
        title: "智能助理",
      }}
      toolbar={[
        {
          type: "orderSelector",
          icon: "shopping-bag",
          title: "OrdderSelector",
        },
        {
          type: "photo",
          title: "Photo",
          img: "https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png",
        },
      ]}
      rightAction={{
        img: "https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png",
      }}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      onImageSend={handlePasteImg}
    />
  )
}
