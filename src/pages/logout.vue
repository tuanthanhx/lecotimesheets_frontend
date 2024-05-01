<template>
  <v-container fluid class="fill-height justify-center">
    <div class="text-center">Logging out...</div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios';

const router = useRouter();

onMounted(async () => {
  try {
    await axios.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed', error);
  }
  // Clear Local Storage
  localStorage.clear();

  // Clear Cookies
  const clearCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  };
  clearCookies();

  // Redirect to login page
  router.push('/login');
});
</script>
