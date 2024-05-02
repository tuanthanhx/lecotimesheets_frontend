<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Timesheets (Member)</h1>
    <v-sheet class="mb-8" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <v-col cols="auto">
              <v-text-field
                style="width: 300px"
                variant="solo"
                clearable
                label="Date Range"
                append-inner-icon="mdi-calendar-month"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-select
                style="width: 300px"
                variant="solo"
                clearable
                label="Jobs"
                :items="[
                  '144 California',
                  '145 Colorado',
                  '146 Florida',
                  '147 Georgia',
                  '148 Texas',
                ]"
              ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-select
                style="width: 200px"
                variant="solo"
                clearable
                label="Member"
                :items="['John Smith', 'Nancy Anderson']"
              ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-select
                style="width: 200px"
                variant="solo"
                clearable
                label="Status"
                :items="['Submitted', 'Approved', 'Paid']"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn
            class="text-none"
            prepend-icon="mdi-plus"
            width="160"
            height="56"
            color="#2B343F"
          >
            Add Time
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table :headers="headers" :items="items" :items-per-page="-1">
        <template v-slot:[`item.break`]="{ item }">
          <v-icon v-if="item.break" icon="mdi-check-circle" />
        </template>
        <template #bottom></template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const headers = ref([
  { title: 'Date', value: 'date', width: 140 },
  { title: 'Job', value: 'job', width: 'auto' },
  { title: 'Member', value: 'member', width: 140 },
  { title: 'Time', value: 'time', width: 140 },
  { title: 'Break', value: 'break', width: 140 },
  { title: 'Time Worked', value: 'timeworked', width: 140 },
  { title: 'Status', value: 'status', width: 140 },
]);
const items = ref([
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
]);
</script>

<style lang="scss" scoped>
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>
