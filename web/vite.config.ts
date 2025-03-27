import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // 默认配置
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://47.242.141.201:8091', // 后端服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 为目标地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去掉 /api 前缀
      },
    },
  },
})
