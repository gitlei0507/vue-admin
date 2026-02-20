/**
 * Tailwind CSS 配置文件
 * 用于自定义 Tailwind CSS 的样式、主题和插件
 * @type {import('tailwindcss').Config}
 */
export default {
  // 内容路径配置 - 指定需要扫描的文件路径
  // Tailwind 会扫描这些文件中使用的类名，并只生成用到的样式（按需生成）
  content: [
    "./index.html",                          // 扫描根目录的 HTML 文件
    "./src/**/*.{vue,js,ts,jsx,tsx}",        // 扫描 src 目录下所有 Vue、JS、TS 文件
  ],

  // 主题配置 - 自定义设计系统的颜色、间距、字体等
  theme: {
    extend: {
      // 在此处扩展默认主题
      // 例如：添加自定义颜色、字体、断点等
      // colors: { primary: '#3490dc' }
    },
  },

  // 插件配置 - 添加 Tailwind CSS 插件以扩展功能
  // 例如：@tailwindcss/forms、@tailwindcss/typography 等
  plugins: [],
}