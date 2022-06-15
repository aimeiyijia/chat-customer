import React, { useCallback, useEffect, useState } from "react"

import Chat, {
  Bubble,
  Modal,
  useMessages,
  List,
  ListItem,
  RichText,
  Image,
} from "@chatui/core"

import multiavatar from "@multiavatar/multiavatar/esm"

import fetch from "@/http"

import { PhotoProvider, PhotoView } from "react-photo-view"
import "react-photo-view/dist/react-photo-view.css"

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
      avatar: "https://api.multiavatar.com/769b860a4aeafa7f28.png",
    },
  },
]

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务",
    isHighlight: true,
    // 执行的命令名称
    // 独有的命令，转人工客服
    type: "call-server",
  },
  {
    name: "债权人会议",
    // isNew: true,
    // 自动回复
    type: "auto-reply",
    links: [
      {
        name: "百度查找",
        type: "url",
        link: "https://www.baidu.com",
      },
      {
        name: "一篇微信文章",
        type: "url",
        link: "https://mp.weixin.qq.com/s/D1NyAoawLE7AWGKo8L8Czw",
      },
    ],
  },
  {
    name: "债权申报",
    type: "auto",
    links: [],
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
      console.log(serverInfo, "客服信息")

      Socket._socket.on("CustomerChatData", (data: any) => {
        console.log(data, "聊天数据")
        console.log(data.data.friendData, "聊天数据")
        const messages = data.data.friendData
        messages.forEach((message: any) => {
          appendMsg({
            type: message.messageType,
            content: { text: message.content },
            position:
              userInfo?.chatUserId === message.chatUserId ? "right" : "left",
            user: {
              avatar:
                userInfo?.chatUserId === message.chatUserId
                  ? "https://api.multiavatar.com/af8fb6cc559fc57600.png"
                  : "https://api.multiavatar.com/769b860a4aeafa7f28.png",
            },
          })
        })
      })
      Socket._socket.on("AssignRobot", (data: any) => {
        console.log(data, "分配机器客服成功")
        useDispatch(setServerInfo(data.data))
      })
      Socket._socket.on("AssignServer", (data: any) => {
        console.log(data, "分配客服成功")
        if (data.code === 201) {
          appendMsg({
            type: "text",
            content: {
              text: data.msg,
            },
            user: {
              avatar: "https://api.multiavatar.com/769b860a4aeafa7f28.png",
            },
            position: "left",
          })
          return
        }
        appendMsg({
          type: "text",
          content: {
            text: data.msg,
          },
          user: {
            avatar: "https://api.multiavatar.com/769b860a4aeafa7f28.png",
          },
          position: "left",
        })
        useDispatch(setServerInfo(data.data))
      })
      Socket._socket.on("CustomerMessage", (data: any) => {
        console.log(data.data, "收到了新消息")
        const message = data.data
        appendMsg({
          type: message.messageType,
          content: { text: message.content },
          position:
            userInfo?.chatUserId === message.chatUserId ? "right" : "left",
          user: {
            avatar:
              userInfo?.chatUserId === message.chatUserId
                ? "https://api.multiavatar.com/af8fb6cc559fc57600.png"
                : "https://api.multiavatar.com/769b860a4aeafa7f28.png",
          },
        })
      })

      // 获取客户原来的咨询信息
      setTimeout(() => {
        console.log("触发事件", Socket._socket)
        Socket._socket.emit("CustomerChatData", userInfo)
        appendMsg({
          type: "system",
          content: {
            text: "智能助理进入对话，为您服务",
          },
        })
        if (serverInfo && serverInfo!.role === "server") {
          Socket._socket.emit("AssignServer", {
            chatUserId: userInfo!.chatUserId,
            serverUserId: serverInfo!.chatUserId,
          })
          return
        }
        Socket._socket.emit("AssignRobot", userInfo)
      })
    }
  }, [userToken])
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages)

  // 发送回调
  function handleSend(type: string, val: any) {
    if (type === "text" && val.trim()) {
      const userMessage = {
        chatUserId: userInfo!.chatUserId,
        chatUserFriendId: serverInfo!.chatUserId,
        sendRole: "customer",
        content: val,
        messageType: "text",
        sendTime: new Date().valueOf(),
        token: userToken,
      }
      console.log(userMessage, "将要发送的消息")
      Socket._socket.emit("CustomerMessage", userMessage)

      setTyping(true)
    }
    if (type === "auto") {
      const userMessage = {
        chatUserId: serverInfo!.chatUserId,
        chatUserFriendId: userInfo!.chatUserId,
        sendRole: "server",
        content: JSON.stringify(val),
        messageType: "auto",
        sendTime: new Date().valueOf(),
        token: userToken,
      }
      console.log(userMessage, "将要发送的消息")
      Socket._socket.emit("CustomerMessage", userMessage)

      setTyping(true)
    }
    if (type === "url") {
      const userMessage = {
        chatUserId: serverInfo!.chatUserId,
        chatUserFriendId: userInfo!.chatUserId,
        sendRole: "server",
        content: JSON.stringify(val),
        messageType: "url",
        sendTime: new Date().valueOf(),
        token: userToken,
      }
      console.log(userMessage, "将要发送的消息")
      Socket._socket.emit("CustomerMessage", userMessage)

      setTyping(true)
    }
  }

  const handlePasteImg = useCallback((e: any) => {
    console.log(e, 123)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(null)
      }, 300)
    })
  }, [])

  // 快捷短语回调，可根据 item 数据做出不同的操作
  function handleQuickReplyClick(item: any) {
    console.log(item, "快捷短语回调")
    const { type, links } = item
    switch (type) {
      case "call-server":
        console.log("召唤人工客服")
        handleSend("text", item.name)
        Socket._socket.emit("AssignServer", {
          chatUserId: userInfo!.chatUserId,
          serverUserId: "",
        })
        break
      case "auto-reply":
        console.log("自动回复", item)
        handleSend("text", item.name)
        setTimeout(() => {
          handleSend("auto", item)
        }, 600)
        break
    }
  }

  function handleGetAutoReplyMessage(item) {
    console.log(item, "点击")
    handleSend("text", item.name)
    setTimeout(() => {
      handleSend("url", item)
    }, 600)
  }

  function renderMessageContent(msg: any) {
    const { type, content } = msg
    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />
      case "image":
        console.log(content, "tupian")
        const imgUrl = "http://192.168.0.181:90/download"
        const imgSrc = imgUrl + JSON.parse(content.text).ftpPath
        return (
          <Bubble type="image">
            <PhotoProvider>
              <PhotoView src={imgSrc}>
                <Image src={imgSrc} alt="" fluid />
              </PhotoView>
            </PhotoProvider>
          </Bubble>
        )
      case "auto":
        return (
          <Bubble>
            <List>
              {JSON.parse(content.text).links.map((o) => {
                return (
                  <ListItem key={o.name}>
                    <span onClick={() => handleGetAutoReplyMessage(o)}>
                      {o.name}
                    </span>
                  </ListItem>
                )
              })}
            </List>
          </Bubble>
        )
      case "url":
        const path = JSON.parse(content.text)
        const html = `<a href="${path.link}">${path.name}</a>`
        return (
          <Bubble>
            <RichText content={html} />
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
          type: "photo",
          title: "发送图片",
          img: "https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png",
        },
      ]}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      onImageSend={handlePasteImg}
    />
  )
}
