import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import SvgIcon from "./components/SvgIcon/index.vue";
import 'virtual:svg-icons-register'
import { ElRadio, ElButton, ElRadioGroup, ElPagination, ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css'
import './assets/style/index.js'

const app = createApp(App)
app.use(router)
app.use(ElPagination)
app.use(ElRadio)
app.use(ElRadioGroup)
app.use(ElButton)
app.use(ElMessage)
app.component('svg-icon', SvgIcon)
app.mount('#app')

