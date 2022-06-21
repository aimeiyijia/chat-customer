import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// import cookie from "js-cookie"
import { RootState } from "./store"

export interface UserState {
  token: string
  userInfo: User | null
  serverInfo: User | null
}

const initialState: UserState = {
  token: "",
  userInfo: null,
  serverInfo: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state: UserState, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearToken: (state: UserState) => {
      state.token = ""
    },
    setUserInfo: (state: UserState, action: PayloadAction<User>) => {
      state.userInfo = action.payload
    },
    clearUserInfo: (state: UserState) => {
      state.userInfo = null
    },
    setServerInfo: (state: UserState, action: PayloadAction<User>) => {
      state.serverInfo = action.payload
    },
    clearServerInfo: (state: UserState) => {
      state.serverInfo = null
    },
  },
})

export const {
  setToken,
  clearToken,
  setUserInfo,
  clearUserInfo,
  setServerInfo,
  clearServerInfo,
} = userSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getToken = (state: RootState) => state.user.token
export const getUserInfo = (state: RootState) => state.user.userInfo
export const getServerInfo = (state: RootState) => state.user.serverInfo

export default userSlice.reducer
