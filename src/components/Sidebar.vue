<template>
  <aside class="left-side-bar" v-if="uid">
    <!-- Brand Logo -->
    <div class="brand-logo">
      <router-link to="/">
        <img src="/backendassets/vendors/images/deskapp-logo-white.svg" alt="logo" class="light-logo" />
      </router-link>
    </div>

    <!-- Sidebar Menu -->
    <div class="menu-block customscroll">
      <div class="sidebar-menu">
        <ul id="accordion-menu">
          <!-- Dashboard -->
          <li>
           
          </li>


          <!-- Contacts -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('contacts')">
              <span class="micon dw dw-user1"></span>
              <span class="mtext">Contacts</span>
            </a>
            <ul v-show="openMenus.contacts" class="submenu">
              <li><router-link to="/suppliers">Suppliers</router-link></li>
              <li><router-link to="/customers">Customers</router-link></li>
            </ul>
          </li>

          <!-- Products Management -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('products')">
              <span class="micon dw dw-box"></span>
              <span class="mtext">Products</span>
            </a>
            <ul v-show="openMenus.products" class="submenu">
              <li><router-link to="/products">Products</router-link></li>
              <li><router-link to="/categories">Categories</router-link></li>
             
            </ul>
          </li>

          <!-- Purchases -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('purchases')">
              <span class="micon dw dw-wallet1"></span>
              <span class="mtext">Purchases</span>
            </a>
            <ul v-show="openMenus.purchases" class="submenu">
              <li><router-link to="/purchases">Purchases</router-link></li>
                 
             
            </ul>
          </li>

          <!-- Sales -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('sales')">
              <span class="micon dw dw-money"></span>
              <span class="mtext">Sales</span>
            </a>
            <ul v-show="openMenus.sales" class="submenu">
              <li><router-link to="/sales">Sales</router-link></li>
             
            </ul>
          </li>

          <!-- Expenses -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('expenses')">
              <span class="micon dw dw-wallet1"></span>
              <span class="mtext">Expenses</span>
            </a>
            <ul v-show="openMenus.expenses" class="submenu">
              <li><router-link to="/expenses">Expense</router-link></li>
           
            </ul>
          </li>

          <!-- Employees / Salary -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('employees')">
              <span class="micon dw dw-id-card"></span>
              <span class="mtext">Employees</span>
            </a>
            <ul v-show="openMenus.employees" class="submenu">
              <li><router-link to="/employees">Employees</router-link></li>
              
            </ul>
          </li>

          <!-- Reports -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('reports')">
              <span class="micon dw dw-analytics1"></span>
              <span class="mtext">Reports</span>
            </a>
            <ul v-show="openMenus.reports" class="submenu">
              <li><router-link to="/reports">Report</router-link></li>
            </ul>
          </li>

          <!-- Settings -->

           <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('reports')">
              <span class="micon dw dw-settings2"></span>
              <span class="mtext">Settings</span>
            </a>
            <ul v-show="openMenus.reports" class="submenu">
              <li></li>
            </ul>
          </li>
          
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive } from 'vue'

const openMenus = reactive({
  userManagement: false,
  contacts: false,
  products: false,
  purchases: false,
  sales: false,
  expenses: false,
  employees: false,
  reports: false
})

const toggleMenu = (menu) => {
  openMenus[menu] = !openMenus[menu]
}
</script>



<script>

export default {
  name: 'Sidebar',
  data() {
    return {
      uid:sessionStorage.getItem('uid')
    };
  },
  methods: {
    
  }
}
</script>

<style scoped>
.submenu {
  list-style: none;
  padding-left: 20px;
  display: block;
}

.dropdown-toggle {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mtext {
  margin-left: 10px;
  font-weight: 500;
}

.left-side-bar {
  background: #0a0a4e;
  color: #fff;
  width: 230px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.brand-logo {
  text-align: center;
  padding: 20px 0;
}
</style>
