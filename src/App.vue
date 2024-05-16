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

const shouldShowSidebar = computed(() => route.name?.startsWith('/admin') || route.name?.startsWith('/member'));
</script>

<style lang="scss" scoped>
.v-main {
  transition: none;
}

@media (max-width: 1279px) {
  .v-main {
    padding-left: 0 !important;
  }
}
</style>
