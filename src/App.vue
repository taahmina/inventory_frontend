
<template>
  <div id="app" class="main-wrapper">
    <HeaderComponent />
    <SidebarComponent />

    <div class="main-container">
      <router-view /> 
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import HeaderComponent from './components/Header.vue'
import SidebarComponent from './components/Sidebar.vue'
import FooterComponent from './components/Footer.vue'
</script>



<!--Css style-->
<link rel="stylesheet" href="/backendassets/vendors/styles/core.css" />
<link rel="stylesheet" href="/backendassets/vendors/styles/style.css" />
