import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path"

const Host = "http://localhost:3000"


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 路径别名
    },
    extensions: [".js", ".json", ".ts"], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  server: {
    port: 2022,
    proxy: {
      "/api": {
        target: Host,
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": {
        target: Host,
        ws: true,
      },
    },
  },
  plugins: [react()]
})
