import React, { useState } from "react"
import styled, { css } from "styled-components"
import {
  Icons,
  ToastContainer,
  toast,
  cssTransition,
  Slide,
} from "react-toastify"
import "react-toastify/ReactToastify.min.css"
import { useNotificationCenter } from "react-toastify/addons/use-notification-center"
import "font-awesome/less/font-awesome.less"
import "react-fontawesome"
import "animate.css"
import { processReturn } from "@/http/utils"
import { login } from "@/api"

const sc = styled

const CardWrapper = sc.div`
  overflow: hidden;
  font-family: Quicksand, arial, sans-serif;
  padding: 24px 0;
`

const CardHeader = sc.header`
  padding-bottom: 32px;
  text-align: center;
`

const CardHeading = sc.span`
  font-size: 24px;
  font-weight: bold;
`

const CardBody = sc.div`
  padding-right: 32px;
  padding-left: 32px;
`

const CardFieldset = sc.fieldset`
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;

  & + & {
    margin-top: 24px;
  }

  &:nth-last-of-type(2) {
    margin-top: 32px;
  }

  &:last-of-type {
    text-align: center;
  }
`

const CardInput = sc.input`
  padding: 7px 0;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #ddd;
  border-left: 0;
  transition: border-bottom-color .25s ease-in;

  &:focus {
    border-bottom-color: #316cf1;
    outline: 0;
  }
`

interface IconProps {
  className?: string
  // children?: React.ReactNode
  big?: boolean
  eye?: boolean
  small?: boolean
  onClick?: () => void
}
export const Icon: React.FC<IconProps> = ({ className, onClick }) => {
  return <span className={className} onClick={onClick}></span>
}

const CardIcon = styled(Icon)`
  color: #666;
  cursor: pointer;
  opacity: 0.25;
  transition: opacity 0.25s ease-in;

  &:hover {
    opacity: 0.95;
  }

  ${(props) =>
    props.big &&
    css`
      font-size: 26px;
    `}

  ${(props) =>
    props.eye &&
    css`
      position: absolute;
      top: 8px;
      right: 0;
    `}

  ${(props) =>
    props.small &&
    css`
      font-size: 14px;
    `}
`

const CardOptionsNote = sc.small`
  padding-top: 8px;
  display: block;
  width: 100%;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
`

const CardButton = sc.button`
  display: block;
  width: 100%;
  padding: 12px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #316cf1;
  border: 0;
  border-radius: 35px;
  outline: none;
  box-shadow: 0 10px 10px rgba(0, 0, 0, .08);
  cursor: pointer;
  transition: all .25s cubic-bezier(.02, .01, .47, 1);

  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, .16);
    transform: translate(0, -5px);
  }
`

const CardLink = sc.a`
  display: inline-block;
  font-size: 12px;
  text-decoration: none;
  color: #aaa;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: color .25s ease-in;

  &:hover {
    color: #777;
  }
`

export default function () {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    platform: "customer",
  })

  const definedAnimate = cssTransition({
    collapseDuration: 500,
    enter: "animate__animated animate__shakeX",
    exit: "animate__animated animate__backOutUp",
  })

  function revealPassword() {
    setIsPasswordVisible(!isPasswordVisible)
  }

  function verifyForm() {
    if (loginForm.username.length === 0) {
      // toast.fail("请输入账号")
      toast("Default Notification !", {
        type: "error",
        delay: 10,
      })
      console.log(1234)
      return false
    }
    if (loginForm.password.length === 0) {
      // toast.fail("请输入密码")
      return false
    }
    return true
  }

  function handleAccountLogin() {
    if (verifyForm()) {
      console.log(loginForm, "账号登录")
      console.log("账号登录")
    }
  }

  function handleVisitorLogin() {
    console.log(loginForm, "游客登录")
  }

  async function handleLogin() {
    // 系统中无该用户时，后端执行先自动注册再登录
    // 有该用户就直接登录
    const res = await processReturn(login(loginForm))
  }

  return (
    <CardWrapper>
      <CardHeader>
        <CardHeading>请登录</CardHeading>
      </CardHeader>

      <CardBody>
        <CardFieldset>
          <CardInput
            placeholder="账号"
            type="text"
            required
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
          />
        </CardFieldset>

        <CardFieldset>
          <CardInput
            placeholder="密码"
            type={!isPasswordVisible ? "password" : "text"}
            required
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />

          <CardIcon onClick={revealPassword} className="fa fa-eye" eye small />
        </CardFieldset>

        <CardFieldset>
          <CardButton type="button" onClick={handleAccountLogin}>
            登录
          </CardButton>
        </CardFieldset>

        <CardFieldset>
          <CardLink onClick={handleVisitorLogin}>游客登录</CardLink>
        </CardFieldset>
      </CardBody>
      <ToastContainer
        position="top-center"
        autoClose={300}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        transition={definedAnimate}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="colored"
        pauseOnHover
      />
    </CardWrapper>
  )
}
