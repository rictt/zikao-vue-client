/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/App.vue",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        // 'primary': "#FEAC01",
        // 'help': '#fbb116'
        'primary': 'var(--el-color-primary)',
        'help': 'var(--el-color-primary)'
      },
    },
  },
  plugins: [],
}

