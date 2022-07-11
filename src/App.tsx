import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';

import Chat, {
  Bubble,
  Modal,
  useMessages,
  List,
  ListItem,
  RichText,
  Image,
} from '@chatui/core';
import type { QuickReplyItemProps } from '@chatui/core';

import Dropzone, { UploadFile, DropzoneRef } from './component/upload';

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import Socket from '@/socket';

import LoginModel from '@/views/login';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  getToken,
  clearToken,
  getUserInfo,
  clearUserInfo,
  getServerInfo,
  setServerInfo,
  clearServerInfo,
} from '@/store/user';

import { processReturn } from '@/http/utils';

export type LinksProps = {
  name: string;
  type: string;
  link?: string;
};
export interface ExtendQuickReplyItemProps extends QuickReplyItemProps {
  type: string;
  content?: string;
  links?: LinksProps[];
}

const initialMessages = [
  {
    type: 'system',
    content: {
      text: '智能助理进入对话，为您服务',
    },
  },
  {
    type: 'text',
    content: {
      text: '通达海破产一体化管理平台用户，您好！感谢您选择我们的产品和服务，请问有什么可以帮助您的？您可以直接沟通或留言，也可以查看快捷简答。',
    },
    user: {
      avatar: 'https://api.multiavatar.com/769b860a4aeafa7f28.png',
    },
  },
];

// 默认快捷短语，可选
const defaultQuickReplies: ExtendQuickReplyItemProps[] = [
  {
    icon: 'message',
    name: '联系人工服务',
    isHighlight: true,
    // 执行的命令名称
    // 独有的命令，转人工客服
    type: 'call-server',
  },
  // 链接类型的快速回复，不要删，后续会用到
  // {
  //   name: "债权人会议",
  //   // isNew: true,
  //   // 自动回复
  //   type: "auto-reply-links",
  //   links: [
  //     {
  //       name: "百度查找",
  //       type: "url",
  //       link: "https://www.baidu.com",
  //     },
  //     {
  //       name: "一篇微信文章",
  //       type: "url",
  //       link: "https://mp.weixin.qq.com/s/D1NyAoawLE7AWGKo8L8Czw",
  //     },
  //   ],
  // },
  // 纯文字类型的快捷回复
  // {
  //   name: "债权申报",
  //   type: "auto-reply-text",
  //   content: "hahahhahahah",
  // },
];

export default function () {
  let userInfo = useAppSelector(getUserInfo);
  let serverInfo = useAppSelector(getServerInfo);
  const userToken = useAppSelector(getToken);
  const useDispatch = useAppDispatch();

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (userToken) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [userToken]);

  const dropzoneRef = useRef<DropzoneRef>(null);

  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  useEffect(() => {
    if (userToken) {
      Socket.connectSocket();
      // 分配客服
      console.log(userInfo, '用户信息');
      console.log(serverInfo, '客服信息');

      Socket._socket.on('CustomerChatData', (data: any) => {
        console.log(data, '历史聊天数据');
        if (!data.data) return;
        const messages = data.data.friendData;
        messages.forEach((message: any) => {
          appendMsg({
            type: message.messageType,
            content: { text: message.content },
            position:
              userInfo?.chatUserId === message.chatUserId ? 'right' : 'left',
            user: {
              avatar:
                userInfo?.chatUserId === message.chatUserId
                  ? 'https://api.multiavatar.com/af8fb6cc559fc57600.png'
                  : 'https://api.multiavatar.com/769b860a4aeafa7f28.png',
            },
          });
        });
      });
      Socket._socket.on('AssignRobot', (data: any) => {
        console.log(data, '分配机器客服成功');
        if (data.code === 401) {
          console.log('分配机器客服时登录超期');
          loginOut();
        }
        useDispatch(setServerInfo(data.data));
      });
      Socket._socket.on('AssignServer', (data: any) => {
        console.log(data, '分配人工客服成功');
        // if (data.code === 201) {
        //   appendMsg({
        //     type: "text",
        //     content: {
        //       text: data.msg,
        //     },
        //     user: {
        //       avatar: "https://api.multiavatar.com/769b860a4aeafa7f28.png",
        //     },
        //     position: "left",
        //   })
        //   return
        // }
        if (data.code === 401) {
          console.log('分配人工客服时登录超期');
          loginOut();
        }
        appendMsg({
          type: 'text',
          content: {
            text: data.msg,
          },
          user: {
            avatar: 'https://api.multiavatar.com/769b860a4aeafa7f28.png',
          },
          position: 'left',
        });
        // appendMsg({
        //   type: "system",
        //   content: {
        //     text: "智能助理进入对话，为您服务",
        //   },
        // })
        useDispatch(setServerInfo(data.data));
      });
      Socket._socket.on('CustomerMessage', (data: any) => {
        console.log(data.data, '收到了新消息');
        const message = data.data;
        appendMsg({
          type: message.messageType,
          content: { text: message.content },
          position:
            userInfo!.chatUserId === message.chatUserId ? 'right' : 'left',
          user: {
            avatar:
              userInfo!.chatUserId === message.chatUserId
                ? 'https://api.multiavatar.com/af8fb6cc559fc57600.png'
                : 'https://api.multiavatar.com/769b860a4aeafa7f28.png',
          },
        });
      });

      // 获取客户原来的咨询信息
      setTimeout(() => {
        console.log('触发获取历史数据事件', Socket._socket);
        Socket._socket.emit('CustomerChatData', {
          ...userInfo,
          token: userToken,
        });
        // appendMsg({
        //   type: "system",
        //   content: {
        //     text: "智能助理进入对话，为您服务",
        //   },
        // })
        if (serverInfo && serverInfo!.role === 'server') {
          console.log('召唤人工客服');
          Socket._socket.emit('AssignServer', {
            chatUserId: userInfo!.chatUserId,
            serverUserId: serverInfo!.chatUserId,
            token: userToken,
          });
          return;
        }
        console.log('召唤机器客服');
        Socket._socket.emit('AssignRobot', {
          ...userInfo,
          token: userToken,
        });
      });
    }
  }, [userToken]);

  function loginOut() {
    useDispatch(clearToken());
    useDispatch(clearUserInfo());
    useDispatch(clearServerInfo());
  }

  // 发送回调
  function handleSend(type: string, val: any) {
    // 文字消息
    if (type === 'text' && val.trim()) {
      const userMessage = {
        chatUserId: userInfo!.chatUserId,
        chatUserFriendId: serverInfo!.chatUserId,
        sendRole: 'customer',
        content: val,
        messageType: 'text',
        sendTime: new Date().valueOf(),
        token: userToken,
      };
      Socket._socket.emit('CustomerMessage', userMessage);

      setTyping(true);
    }
    // 自动回复的消息
    if (type === 'auto-reply-links') {
      const userMessage = {
        chatUserId: serverInfo!.chatUserId,
        chatUserFriendId: userInfo!.chatUserId,
        sendRole: 'server',
        content: JSON.stringify(val),
        messageType: 'links',
        sendTime: new Date().valueOf(),
        token: userToken,
      };
      console.log(userMessage, '将要发送的消息');
      Socket._socket.emit('CustomerMessage', userMessage);

      setTyping(true);
    }

    if (type === 'auto-reply-text') {
      const userMessage = {
        chatUserId: serverInfo!.chatUserId,
        chatUserFriendId: userInfo!.chatUserId,
        sendRole: 'server',
        content: val,
        messageType: 'text',
        sendTime: new Date().valueOf(),
        token: userToken,
      };
      console.log(userMessage, '将要发送的消息');
      Socket._socket.emit('CustomerMessage', userMessage);

      setTyping(true);
    }
    // 链接类型的消息
    if (type === 'url') {
      const userMessage = {
        chatUserId: serverInfo!.chatUserId,
        chatUserFriendId: userInfo!.chatUserId,
        sendRole: 'server',
        content: JSON.stringify(val),
        messageType: 'url',
        sendTime: new Date().valueOf(),
        token: userToken,
      };
      console.log(userMessage, '将要发送的消息');
      Socket._socket.emit('CustomerMessage', userMessage);

      setTyping(true);
    }
  }

  const handlePasteImg = useCallback((file: File) => {
    console.log(file, '复制粘贴的文件');
    if (dropzoneRef.current) {
      dropzoneRef.current
        .uploadFilePromise(file)
        .then((res) => {
          console.log(res, '上传');
          if (res) {
            handleFileUploadSuccess(res);
          } else {
            console.log('上传失败');
          }
        })
        .catch((err) => {
          console.log('上传失败', err);
        });
    }
    // onImageSend的回调，没什么作用
    return Promise.resolve();
  }, []);

  // 快捷短语回调，可根据 item 数据做出不同的操作
  function handleQuickReplyClick(item: QuickReplyItemProps) {
    const { type } = item as ExtendQuickReplyItemProps;
    switch (type) {
      case 'call-server':
        // 已经分配了人工客服就不再分配了
        if (serverInfo && serverInfo.role === 'server') return;
        console.log('召唤人工客服');
        handleSend('text', item.name);
        Socket._socket.emit('AssignServer', {
          chatUserId: userInfo!.chatUserId,
          serverUserId: '',
          token: userToken,
        });
        break;
      case 'auto-reply-links':
        console.log('自动回复', item);
        handleSend('text', item.name);
        setTimeout(() => {
          handleSend('auto-reply-links', item);
        }, 800);
        break;
      case 'auto-reply-text':
        console.log('自动回复', item);
        handleSend('text', item.name);
        setTimeout(() => {
          handleSend(
            'auto-reply-text',
            (item as ExtendQuickReplyItemProps).content,
          );
        }, 800);
        break;
    }
  }

  function handleGetAutoReplyMessage(item: LinksProps) {
    handleSend('text', item.name);
    setTimeout(() => {
      handleSend('url', item);
    }, 600);
  }

  // 目前只支持图片上传
  function handleToolbarClick() {
    console.log(dropzoneRef);
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  }
  const handleFileUploadSuccess = useCallback((file: UploadFile) => {
    const userMessage = {
      chatUserId: userInfo!.chatUserId,
      chatUserFriendId: serverInfo!.chatUserId,
      sendRole: 'customer',
      content: JSON.stringify(file),
      messageType: 'image',
      time: new Date().valueOf(),
      token: userToken,
    };
    console.log(userMessage, '消息');

    Socket._socket.emit('CustomerMessage', userMessage);

    console.log('上传成功');
  }, []);

  function renderMessageContent(msg: any) {
    const { type, content } = msg;
    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        const imgUrl = 'http://192.168.0.181:90/download';
        const imgSrc = imgUrl + JSON.parse(content.text).ftpPath;
        return (
          <Bubble type="image">
            <PhotoProvider>
              <PhotoView src={imgSrc}>
                <Image src={imgSrc} alt="" fluid />
              </PhotoView>
            </PhotoProvider>
          </Bubble>
        );
      case 'links':
        // 标签类型错误主要是chatui没适配react18导致的
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
                );
              })}
            </List>
          </Bubble>
        );
      case 'url':
        const path = JSON.parse(content.text);
        const html = `<a href="${path.link}">${path.name}</a>`;
        return (
          <Bubble>
            <RichText content={html} />
          </Bubble>
        );
      default:
        return null;
    }
  }

  const DropzoneFile = useMemo(
    () => (
      <Dropzone
        ref={dropzoneRef}
        onFileUploadSuccess={handleFileUploadSuccess}
      />
    ),
    [],
  );
  return open ? (
    <Modal active={open} showClose={false} backdrop="static">
      <LoginModel></LoginModel>
    </Modal>
  ) : (
    <>
      <Chat
        wideBreakpoint="600px"
        messages={messages}
        navbar={{
          leftContent: {
            icon: 'chevron-left',
            title: 'Back',
          },
          rightContent: [
            {
              icon: 'apps',
              title: 'Applications',
            },
            {
              icon: 'ellipsis-h',
              title: 'More',
            },
          ],
          title: '智能助理',
        }}
        toolbar={[
          {
            type: 'photo',
            title: '发送图片',
            img: 'https://gw.alicdn.com/tfs/TB1eDjNj.T1gK0jSZFrXXcNCXXa-80-80.png',
          },
        ]}
        renderMessageContent={renderMessageContent}
        quickReplies={defaultQuickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}
        onImageSend={handlePasteImg}
        onToolbarClick={handleToolbarClick}
      />
      {DropzoneFile}
    </>
  );
}
