<template>
  <v-app>
    <Sidebar v-if="shouldShowSidebar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const shouldShowSidebar = computed(() =>
  route.name?.startsWith('/admin') ||
  route.name?.startsWith('/member')
);
</script>

<style lang="scss" scoped>
.v-application {
  background: #f6f6f6 !important;
}

.v-main {
  transition: none;
}
</style>
