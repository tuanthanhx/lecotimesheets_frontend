<template>
  <v-navigation-drawer permanent class="py-6" width="300" color="#2B343F">
    <v-card width="260" height="80" class="d-flex align-center mx-auto mb-8" color="#fff" rounded>
      <v-img width="220" height="66" src="@/assets/img/logo.png" />
    </v-card>
    <v-list v-if="userData?.isAdmin">
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
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const userData = userStore.userData;
</script>

<style lang="scss" scoped>
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 55px !important;
}

:deep(.v-list-item__prepend > .v-icon ~ .v-list-item__spacer) {
  width: 16px;
}
</style>
