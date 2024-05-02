<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Payrolls</h1>

    <v-row>
      <v-col cols="auto">
        <v-select
          style="width: 300px"
          variant="solo"
          clearable
          label="Select Member"
          v-model="selectedMember"
          :items="['John Smith', 'Nancy Anderson']"
        ></v-select>
      </v-col>
      <v-col cols="auto" class="ml-auto" v-if="selectedMember">
        <v-btn
          class="text-none"
          prepend-icon="mdi-currency-usd"
          width="160"
          height="56"
          color="#2B343F"
        >
          Pay now
        </v-btn>
      </v-col>
    </v-row>

    <template v-if="!selectedMember">
      <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg">
        <v-card
          class="d-flex flex-nowrap justify-center align-center"
          min-height="260"
          elevation="0"
        >
          <v-card-text class="text-center">
            <v-icon
              icon="mdi-text-search"
              size="64"
              color="rgba(0,0,0,.3)"
            ></v-icon>
            <p class="mt-4">Select a member to analyze data</p>
          </v-card-text>
        </v-card>
      </v-sheet>
    </template>

    <template v-else>
      <h2 class="text-h6 mb-4">{{ selectedMember }}</h2>
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
  { title: 'Date', value: 'date', width: 140, summable: false },
  { title: 'Job', value: 'job', width: 'auto', summable: false },
  { title: 'Time', value: 'time', width: 140, summable: false },
  { title: 'Break', value: 'break', width: 140, summable: false },
  { title: 'Time Worked', value: 'timeworked', width: 140, summable: true },
  { title: 'Hourly Rate', value: 'rate', width: 140, summable: false },
  { title: 'Wage', value: 'wage', width: 140, summable: true },
]);

const items = ref([
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 4,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 5,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 6,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 7,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 8,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 9,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 10,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 11,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: false,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
  {
    id: 12,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    time: '08:00 - 16:00',
    break: true,
    timeworked: 200,
    rate: 20,
    wage: 200,
  },
]);
</script>

<style lang="scss" scoped></style>
