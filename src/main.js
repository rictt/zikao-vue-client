import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import SvgIcon from "./components/SvgIcon/index.vue";
import 'virtual:svg-icons-register'
import { ElRadio, ElButton, ElRadioGroup, ElPagination } from 'element-plus';
import './assets/style/index.js'

const app = createApp(App)
app.use(router)
app.use(ElPagination)
app.use(ElRadio)
app.use(ElRadioGroup)
app.use(ElButton)
app.component('svg-icon', SvgIcon)
app.mount('#app')

