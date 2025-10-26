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
    
  },

  // ===== Category Routes =====
  {
    path: "/categories",
    name: "category_list",
    component: () => import("../views/Categories/CategoryList.vue"),
  },
  {
    path: "/add_category",
    name: "category_create",
    component: () => import("../views/Categories/CategoryCreate.vue"),
  },
  {
    path: "/edit_category/:id",
    name: "category_edit",
    component: () => import("../views/Categories/CategoryEdit.vue"),
    props: true, // allow route params as props
  },

// ===== Product Routes =====
{
  path: "/products",
  name: "product_list",
  component: () => import("../views/Products/ProductList.vue"),
},
{
  path: "/products/add",
  name: "product_create",
  component: () => import("../views/Products/ProductCreate.vue"),
},
{
  path: "/products/edit/:id",
  name: "product_edit",
  component: () => import("../views/Products/ProductEdit.vue"),
  props: true, // allow route params as props
},


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
