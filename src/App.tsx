import React, { useCallback, useState } from "react"
import LoginModel from './login'
// 引入组件
import Chat, { Bubble, useMessages } from "@chatui/core"
// 引入样式

import { useAppSelector, useAppDispatch } from "./store/hooks"
import {
  decrement,
  increment,
  incrementByAmount,
  selectCount,
} from "./store/counter"

// const count = useAppSelector(selectCount)
// const dispatch = useAppDispatch()
// const [incrementAmount, setIncrementAmount] = useState("2")

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
      avatar: "//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg",
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
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages)

  // 发送回调
  function handleSend(type: string, val: any) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      })

      setTyping(true)

      // 模拟回复消息
      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "亲，您遇到什么问题啦？请简要描述您的问题~" },
        })
      }, 1000)
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

  return (
    <LoginModel></LoginModel>
  )

  // return (
    // <Chat
    //   wideBreakpoint="600px"
    //   messages={messages}
    //   navbar={{
    //     leftContent: {
    //       icon: "chevron-left",
    //       title: "Back",
    //     },
    //     rightContent: [
    //       {
    //         icon: "apps",
    //         title: "Applications",
    //       },
    //       {
    //         icon: "ellipsis-h",
    //         title: "More",
    //       },
    //     ],
    //     title: "智能助理",
    //   }}
    //   toolbar={[
    //     {
    //       type: "orderSelector",
    //       icon: "shopping-bag",
    //       title: "OrdderSelector",
    //     },
    //     {
    //       type: "photo",
    //       title: "Photo",
    //       img: "https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png",
    //     },
    //   ]}
    //   rightAction={{
    //     img: "https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png",
    //   }}
    //   renderMessageContent={renderMessageContent}
    //   quickReplies={defaultQuickReplies}
    //   onQuickReplyClick={handleQuickReplyClick}
    //   onSend={handleSend}
    //   onImageSend={handlePasteImg}
    // />
  // )
}
