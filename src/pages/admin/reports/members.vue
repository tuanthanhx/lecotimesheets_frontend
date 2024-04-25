<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Member Reports</h1>

    <v-select style="width: 300px;" dense variant="solo" clearable label="Select Member" v-model="selectedMember"
      :items="['John Smith', 'Nancy Anderson']"></v-select>

    <template v-if="!selectedMember">
      <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg">
        <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
          <v-card-text class="text-center">
            <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
            <p class="mt-4">Select a member to analyze data</p>
          </v-card-text>
        </v-card>
      </v-sheet>
    </template>

    <template v-else>
      <h2 class="text-h6 mb-4">{{ selectedMember }}</h2>
      <v-sheet class="pa-8 mb-4" color="#ffffff" border="sm" rounded="lg">
        Total Time Worked: 20h30m<br>
        Total Amount Earned: $20,000<br>
        Paid: $18,000<br>
        Profit: $2,000
      </v-sheet>

      <h2 class="text-h6 mb-4">Timesheets</h2>
      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
        <v-data-table :headers="headers" :items="items" :items-per-page="-1">
          <template v-slot:[`item.break`]="{ item }">
            <v-icon v-if="item.break" icon="mdi-check-circle" />
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-sheet>
    </template>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const selectedMember = ref(null);

const headers = ref([
  { title: 'Date', value: 'date', width: 140 },
  { title: 'Job', value: 'job', width: 'auto' },
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
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 4,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 5,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 6,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 7,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 8,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 9,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 10,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 11,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 12,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
]);

</script>

<style lang="scss" scoped></style>
