import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// ✅ Import Bootstrap Icons (for beautiful icons in sidebar, tables, buttons, etc.)
import 'bootstrap-icons/font/bootstrap-icons.css';


createApp(App).use(router).mount('#app')

