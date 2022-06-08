import React, { useState } from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import "font-awesome/less/font-awesome.less"
import "react-fontawesome"

const sc = styled

const CardWrapper = sc.div`
  overflow: hidden;
  padding: 0 0 32px;
  margin: 48px auto 0;
  width: 300px;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, .05), 0 0px 40px rgba(0, 0, 0, .08);
  border-radius: 5px;
`

const CardHeader = sc.header`
  padding-top: 32px;
  padding-bottom: 32px;
`

const CardHeading = sc.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
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
    border-bottom-color: #e5195f;
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

const CardOptions = sc.ul`
  padding: 0;
  margin: 16px 0 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  list-style-type: none;
`

const CardOptionsItem = sc.li`
  &:nth-of-type(n+2) {
    margin-left: 16px;
  }
`

const CardButton = sc.button`
  display: block;
  width: 100%;
  padding: 12px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #e5195f;
  border: 0;
  border-radius: 35px;
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
  function revealPassword() {
    console.log(1234)
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <CardWrapper>
      <CardHeader>
        <CardHeading>New User</CardHeading>
      </CardHeader>

      <CardBody>
        <CardFieldset>
          <CardInput placeholder="Username" type="text" required />
        </CardFieldset>

        <CardFieldset>
          <CardInput placeholder="E-mail" type="text" required />
        </CardFieldset>

        <CardFieldset>
          <CardInput
            placeholder="Password"
            type={!isPasswordVisible ? "password" : "text"}
            required
          />

          <CardIcon onClick={revealPassword} className="fa fa-eye" eye small />
        </CardFieldset>

        <CardFieldset>
          <CardOptionsNote>Or sign up with</CardOptionsNote>

          <CardOptions>
            <CardOptionsItem>
              <CardIcon
                onClick={revealPassword}
                className="fa fa-google-plus"
                big
              />
            </CardOptionsItem>

            <CardOptionsItem>
              <CardIcon
                onClick={revealPassword}
                className="fa fa-twitter"
                big
              />
            </CardOptionsItem>

            <CardOptionsItem>
              <CardIcon
                onClick={revealPassword}
                className="fa fa-facebook"
                big
              />
            </CardOptionsItem>
          </CardOptions>
        </CardFieldset>

        <CardFieldset>
          <CardButton type="button">Sign Up</CardButton>
        </CardFieldset>

        <CardFieldset>
          <CardLink>I already have an account</CardLink>
        </CardFieldset>
      </CardBody>
    </CardWrapper>
  )
}

// class Card extends React.Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       isPasswordVisible: false,
//     }

//     this.revealPassword = this.revealPassword.bind(this)
//   }
// }
