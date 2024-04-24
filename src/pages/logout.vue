<template>
  <div>Logging out...</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
  // Function to clear localStorage
  localStorage.clear();

  // Function to clear all cookies
  function clearCookies() {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }

  // Clear cookies
  clearCookies();

  // Use useRouter to handle redirection
  const router = useRouter();

  // Redirect to login page
  router.push('/login');
});
</script>
