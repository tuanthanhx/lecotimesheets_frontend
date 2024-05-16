<template>
  <v-app-bar app v-model="showAppBar" class="d-flex d-lg-none">
    <v-app-bar-nav-icon position="absolute" @click="showMenu = !showMenu"></v-app-bar-nav-icon>
    <v-toolbar-title class="d-flex justify-center">
      <v-img class="pa-4" width="160" height="auto" aspect-ratio="220/66" src="@/assets/img/logo.png" />
    </v-toolbar-title>
  </v-app-bar>

  <div class="overlay" :class="{ 'is-active': showMenu }" @click="showMenu = false"></div>
  <v-navigation-drawer app v-model="showMenu" permanent class="py-6 common-drawer" :class="{ active: showMenu }" :width="300" color="#2b343f">
    <v-card width="260" height="80" class="d-none d-lg-flex align-center mx-auto mb-8" color="#fff" rounded>
      <v-img width="220" height="auto" aspect-ratio="220/66" src="@/assets/img/logo.png" />
    </v-card>
    <v-list v-if="userData?.group === 6">
      <v-list-item title="Timesheets" prepend-icon="mdi-clock-time-three" link to="/admin/timesheets"></v-list-item>
      <v-list-item title="Jobs" prepend-icon="mdi-folder-text" link to="/admin/jobs"></v-list-item>
      <v-list-item title="Members" prepend-icon="mdi-account-group" link to="/admin/members"></v-list-item>
      <v-list-group value="Reports">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-file-chart" title="Reports"></v-list-item>
        </template>
        <v-list-item title="Job Reports" prepend-icon="mdi-file-document-outline" link to="/admin/reports/jobs"></v-list-item>
        <v-list-item title="Member Reports" prepend-icon="mdi-file-table-outline" link to="/admin/reports/members"></v-list-item>
        <v-list-item title="Payroll Reports" prepend-icon="mdi-file-send-outline" link to="/admin/reports/payrolls"></v-list-item>
      </v-list-group>
      <v-list-item title="Payrolls" prepend-icon="mdi-receipt-text" link to="/admin/payrolls"></v-list-item>
      <v-list-item title="Settings" prepend-icon="mdi-cog" link to="/admin/settings"></v-list-item>
      <v-list-item title="Logout" prepend-icon="mdi-logout" link to="/logout"></v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item title="Timesheets" prepend-icon="mdi-clock-time-three" link to="/member/timesheets"></v-list-item>
      <v-list-item title="Jobs" prepend-icon="mdi-folder-text" link to="/member/jobs"></v-list-item>
      <v-list-item title="Payroll Reports" prepend-icon="mdi-receipt-text" link to="/member/payroll_reports"></v-list-item>
      <v-list-item title="Settings" prepend-icon="mdi-cog" link to="/member/settings"></v-list-item>
      <v-list-item title="Logout" prepend-icon="mdi-logout" link to="/logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/userStore';

const { mdAndDown } = useDisplay();

const userStore = useUserStore();
const userData = userStore.userData;

const showAppBar = ref(false);
const showMenu = ref(false);

watch(mdAndDown, (isMdAndDown) => {
  showAppBar.value = isMdAndDown;
  showMenu.value = !isMdAndDown;
});

onMounted(() => {
  showAppBar.value = mdAndDown.value;
  showMenu.value = !mdAndDown.value;
});
</script>

<style lang="scss" scoped>
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 55px !important;
}

:deep(.v-list-item__prepend > .v-icon ~ .v-list-item__spacer) {
  width: 16px;
}

@media (max-width: 1279px) {
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 200;
    pointer-events: none;
    opacity: 0;
    transition: all ease 0.5s;
    &.is-active {
      opacity: 1;
      pointer-events: auto;
    }
  }
}

@media (max-width: 599px) {
  .common-drawer {
    width: 100% !important;
  }
}
</style>
