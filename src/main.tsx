import React from "react"
import { createRoot } from "react-dom/client"
import "normalize.css"
import App from "./App"
import "./index.less"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./store/store"

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
