<template>
  <v-app>
    <Sidebar v-if="shouldShowSidebar" />
    <v-main>
      <router-view />
    </v-main>
    <v-overlay
      :model-value="appStore.isRouteLoading"
      persistent
      class="route-loading-overlay d-flex align-center justify-center"
      scrim="#ffffff"
      opacity="0.72"
    >
      <v-progress-circular indeterminate color="primary" size="48" width="4" />
    </v-overlay>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const appStore = useAppStore();

const shouldShowSidebar = computed(() => route.name?.startsWith('/admin') || route.name?.startsWith('/member'));
</script>

<style lang="scss" scoped>
.v-main {
  transition: none;
}

.route-loading-overlay {
  z-index: 3000 !important;
}

@media (max-width: 1279px) {
  .v-main {
    padding-left: 0 !important;
  }
}
</style>
