<template>
  <div id="app" class="main-wrapper">
    <!-- Show layout components only if not on login page -->
    <HeaderComponent v-if="showLayout" />
    <SidebarComponent v-if="showLayout" />

    <div class="main-container">
      <router-view /> 
    </div>

    <FooterComponent v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderComponent from './components/Header.vue'
import SidebarComponent from './components/Sidebar.vue'
import FooterComponent from './components/Footer.vue'

const route = useRoute()

// Hide layout components on login (and optionally register) routes
const showLayout = computed(() => {
  return !['login', 'register'].includes(route.name)
})
</script>

<script>
export default {
  name: 'App',
  data() {
    return {
      uid: sessionStorage.getItem('uid')
    }
  },
  methods: {
    logout() {
      this.uid = ""
      sessionStorage.setItem('uid', '')
      window.location.href = '/'
    }
  }
}
</script>

<!-- CSS style -->
<link rel="stylesheet" href="/backendassets/vendors/styles/core.css" />
<link rel="stylesheet" href="/backendassets/vendors/styles/style.css" />
