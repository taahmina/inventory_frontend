<template>
  <footer class="footer">
    <p>© {{ new Date().getFullYear() }} DeskApp Vue Dashboard. All Rights Reserved.</p>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 15px 0;
  color: #555;
  margin-left: 240px; /* sidebar width */
}
</style>
