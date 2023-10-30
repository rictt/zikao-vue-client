import { createApp } from 'vue'
import './assets/style/style.css'
import './assets/style/tailwind.css'
import App from './App.vue'
import { router } from './router'
import SvgIcon from "./components/SvgIcon/index.vue";
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(router)
app.component('svg-icon', SvgIcon)
app.mount('#app')
