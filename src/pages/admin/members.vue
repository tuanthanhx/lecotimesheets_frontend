<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Members</h1>
    <v-sheet class="mb-8" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <v-col cols="auto">
              <v-text-field style="width: 300px;" dense variant="solo" clearable label="Search Members"
                append-inner-icon="mdi-magnify"></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-select style="width: 200px;" dense variant="solo" clearable label="Status"
                :items="['Active', 'Deactivated']"></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn class="text-none" prepend-icon="mdi-plus" width="160" height="56" color="#2B343F">
            Add Member
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table :headers="headers" :items="items" :items-per-page="25">
        <template v-slot:[`item.break`]="{ item }">
          <v-icon v-if="item.break" icon="mdi-check-circle" />
        </template>
      </v-data-table>
    </v-sheet>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const headers = ref([
  { title: 'Username', value: 'username', width: 140 },
  { title: 'Full Name', value: 'fullname', width: 140 },
  { title: 'D.O.B', value: 'dob', width: 140 },
  { title: 'Address', value: 'address', width: 'auto' },
  { title: 'Phone', value: 'phone', width: 140 },
  { title: 'Hourly Rate', value: 'rate', width: 140 },
  { title: 'Status', value: 'status', width: 140 },
]);
const items = ref([
  {
    id: 1,
    username: 'johnsm',
    fullname: 'John Smith',
    dob: '01-02-1993',
    address: '100 Sample st.',
    phone: '021 234-5678',
    rate: 20,
    status: 'Active',
  },
  {
    id: 2,
    username: 'johnsm',
    fullname: 'John Smith',
    dob: '01-02-1993',
    address: '100 Sample st.',
    phone: '021 234-5678',
    rate: 20,
    status: 'Active',
  },
  {
    id: 3,
    username: 'johnsm',
    fullname: 'John Smith',
    dob: '01-02-1993',
    address: '100 Sample st.',
    phone: '021 234-5678',
    rate: 20,
    status: 'Active',
  },
  {
    id: 4,
    username: 'johnsm',
    fullname: 'John Smith',
    dob: '01-02-1993',
    address: '100 Sample st.',
    phone: '021 234-5678',
    rate: 20,
    status: 'Active',
  },
  {
    id: 5,
    username: 'johnsm',
    fullname: 'John Smith',
    dob: '01-02-1993',
    address: '100 Sample st.',
    phone: '021 234-5678',
    rate: 20,
    status: 'Active',
  },
]);
</script>

<style lang="scss" scoped>

</style>
