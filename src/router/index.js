import { createRouter, createWebHistory } from 'vue-router'
//import Dashboard from '../views/Dashboard.vue'

const routes = [

  {
    path: "/",
    alias: "/login",
    name: "login",
    component: () => import('../views/LoginForm.vue'),
  },

{
  path: "/register",
  name: "register",
  component: () => import("../views/RegisterForm.vue"),
},

  {
    path: '/dashboard',
    alias: "/dashboard",
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    
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

// ===== Supplier Routes =====
{
  path: "/suppliers",
  name: "supplier_list",
  component: () => import("../views/Suppliers/SupplierList.vue"),
},
{
  path: "/add_supplier",
  name: "supplier_create",
  component: () => import("../views/Suppliers/SupplierCreate.vue"),
},
{
  path: "/edit_supplier/:id",
  name: "supplier_edit",
  component: () => import("../views/Suppliers/SupplierEdit.vue"),
  props: true,
},


  // ===== Purchase Routes =====
  {
    path: "/purchases",
    name: "purchase_list",
    component: () => import("../views/Purchases/PurchaseList.vue"),
  },
  {
    path: "/purchases/add",
    name: "purchase_create",
    component: () => import("../views/Purchases/PurchaseCreate.vue"),
  },
  {
    path: "/purchases/edit/:id",
    name: "purchase_edit",
    component: () => import("../views/Purchases/PurchaseEdit.vue"),
    props: true,
  },
  
  // ===== Sales Routes =====
{
  path: "/sales",
  name: "sale_list",
  component: () => import("../views/Sales/SaleList.vue"),
},
{
  path: "/sales/add",
  name: "sale_create",
  component: () => import("../views/Sales/SaleCreate.vue"),
},
{
  path: "/sales/edit/:id",
  name: "sale_edit",
  component: () => import("../views/Sales/SaleEdit.vue"),
  props: true,
},

// ===== CUSTOMER ROUTES =====
{
  path: "/customers",
  name: "customer_list",
  component: () => import("../views/Customers/CustomerList.vue")
},
{
  path: "/customers/add",
  name: "customer_create",
  component: () => import("../views/Customers/CustomerCreate.vue")
},
{
  path: "/customers/edit/:id",
  name: "customer_edit",
  component: () => import("../views/Customers/CustomerEdit.vue"),
  props: true
},
// ===== Employee Routes =====
{
  path: "/employees",
  name: "employee_list",
  component: () => import("../views/Employees/EmployeeList.vue"),
},
{
  path: "/employees/add",
  name: "employee_create",
  component: () => import("../views/Employees/EmployeeCreate.vue"),
},
{
  path: "/employees/edit/:id",
  name: "employee_edit",
  component: () => import("../views/Employees/EmployeeEdit.vue"),
  props: true, // allow route params as props
},





]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
