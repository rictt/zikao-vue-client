import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },

  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },

  server: {
    // origin: "https://servicewechat.com"
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/client': {
        target: 'https://img.chen666.top', // 需要代理的地址
        changeOrigin: true,
        secure: true, // 如果是https接口，需要配置这个参数
        rewrite: (path) => {
          const result = path.replace(/^\/client/, '')
          console.log(result)
          return result
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // req是当前真实请求的地址 开发环境为：a.shop.com:8082
            // proxyReq.setHeader('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.32(0x18002038) NetType/WIFI Language/zh_CN')
            // proxyReq.setHeader('host', `img.chen666.top`)
            // proxyReq.setHeader('referer', `https://servicewechat.com/`)
            // proxyReq.setHeader('origin', `https://img.chen666.top`)
            // proxyReq.setHeader('connection', 'keep-alive')
            // proxyReq.setHeader('accept-language', 'zh-cn')
            // proxyReq.setHeader('accept', 'image/webp,image/apng,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5')
            // proxyReq.removeHeader('origin')
            // proxyReq.removeHeader('sec-fetch-dest')
            // proxyReq.removeHeader('sec-fetch-mode')
            // proxyReq.removeHeader('sec-fetch-site')
            // proxyReq.removeHeader('sec-ch-ua-platform')
            // proxyReq.removeHeader('sec-ch-ua-mobile')
            // proxyReq.removeHeader('sec-ch-ua')
            // console.log(req.headers.referer)
          })
        },
      },
    }
  }
  // server: {
  //   proxy: {}
  // }
})
