<template>
  <header class="header">
    <div class="header-left">
      <div class="menu-icon dw dw-menu"></div>
   
      <h2 style="text-align: center;">InventoMart</h2>

    </div>
    
<div class="header-right" v-if="uid">
  <div class="user-info-dropdown">
    <img :src="userImage" class="user-avatar" width="32" height="32" />
    <span class="user-name">{{ userName }}</span>
    <ul class="user-menu">
      <li><a href="#"><i class=""></i></a></li>
      <li><a href="#" class="text-danger" @click="logout"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
    </ul>
  </div>
</div>



  </header>
</template>



<script>

export default {
  name: 'App',
  data() {
    return {
      uid:sessionStorage.getItem('uid')
    };
  },
  methods: {
    logout() {
      this.uid="";
      sessionStorage.setItem('uid', '');
      window.location.href='/';
    }
  }
}
</script>



<style scoped>
.header {
  background: #e9dcdc;
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<style scoped>
.header-left {
  display: flex;
  align-items: center;       /* vertically center items */
  justify-content: center;   /* horizontally center h2 and icon */
  position: relative;        /* allows absolute positioning if needed */
}

.menu-icon {
  position: absolute;        /* keep the menu icon on the left */
  left: 10px;                /* adjust spacing */
}

.header-left h2 {
  margin: 0;
  text-align: center;
  width: 100%;               /* let h2 take full width */
}
</style>