<template>
  <v-navigation-drawer class="py-6" width="300" color="#2B343F">
    <v-card width="260" height="80" class="d-flex align-center mx-auto mb-8" color="#fff" rounded>
      <v-img width="220" height="66" src="@/assets/img/logo.png" />
    </v-card>
    <v-list>
      <v-list-item title="Timesheets" prepend-icon="mdi-clock-time-three" link href="/admin/timesheets"></v-list-item>
      <v-list-item title="Jobs" prepend-icon="mdi-folder-text" link href="/admin/jobs"></v-list-item>
      <v-list-item title="Members" prepend-icon="mdi-account-group" link href="#"></v-list-item>
      <v-list-group value="Reports">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-chart"
            title="Reports"
          ></v-list-item>
        </template>
        <v-list-item title="Job Reports" prepend-icon="mdi-file-document-outline" link href="#"></v-list-item>
        <v-list-item title="Member Reports" prepend-icon="mdi-file-table-outline" link href="#"></v-list-item>
        <v-list-item title="Payroll Reports" prepend-icon="mdi-file-send-outline" link href="#"></v-list-item>
      </v-list-group>
      <v-list-item title="Payrolls" prepend-icon="mdi-receipt-text" link href="#"></v-list-item>
      <v-list-item title="Settings" prepend-icon="mdi-cog" link href="#"></v-list-item>
      <v-list-item title="Logout" prepend-icon="mdi-logout" link href="#"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  //
</script>
