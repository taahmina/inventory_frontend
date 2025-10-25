import { createRouter, createWebHistory } from 'vue-router'
//import Dashboard from '../views/Dashboard.vue'

const routes = [

  {
    path: "/",
    alias: "/login",
    name: "login",
    component: () => import('../views/LoginForm.vue')
  },
  {
    path: '/dashboard',
    alias: "/dashboard",
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue')
    
    
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
