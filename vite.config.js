/**
 * Vite 配置文件
 * 用于配置 Vue 3 项目的构建和开发环境
 */

// Vue 3 官方插件，提供 Vue 单文件组件支持
import vue from '@vitejs/plugin-vue'
// Node.js 内置模块，用于处理文件路径
import { fileURLToPath, URL } from 'node:url'
// Vite 配置定义函数
import { defineConfig } from 'vite'

// 自动导入插件 - 无需手动 import 即可使用 Vue API 和组件
import AutoImport from 'unplugin-auto-import/vite'
// Element Plus 组件解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 组件自动注册插件
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    // Vue 3 支持
    vue(),

    // API 自动引入 - 自动导入 Vue 3 的 ref、computed、watch 等 API
    // 以及 Element Plus 的组件方法（如 ElMessage）
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
    }),

    // 组件自动注册 - 自动按需引入 Element Plus 组件
    // 无需手动在组件中 import，使用时会自动注册
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  server: {
    proxy: {
      // 只要请求路径以 /api 开头，就转发到后端
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 转发时去掉 /api 前缀
      }
    }
  },

  resolve: {
    alias: {
      // 路径别名配置 - '@' 指向 'src' 目录
      // 例如：import App from '@/App.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})