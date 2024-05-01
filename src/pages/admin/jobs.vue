<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Jobs</h1>
    <v-sheet class="mb-8" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <v-col cols="auto">
              <v-text-field
                style="width: 300px"
                dense
                variant="solo"
                clearable
                label="Search Jobs"
                append-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                style="width: 300px"
                dense
                variant="solo"
                clearable
                label="Date Range"
                append-inner-icon="mdi-calendar-month"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-select
                style="width: 200px"
                dense
                variant="solo"
                clearable
                label="Status"
                :items="['Open', 'Close']"
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
            Add Job
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
  { title: 'Date', value: 'date', width: 140 },
  { title: 'Job Name', value: 'name', width: 'auto' },
  { title: 'Revenue', value: 'revenue', width: 140 },
  { title: 'Material Cost', value: 'material', width: 140 },
  { title: 'Status', value: 'status', width: 140 },
]);
const items = ref([
  {
    id: 1,
    date: '05-03-2024',
    name: '100 Loxodonta Africana',
    revenue: 1000,
    material: 2000,
    status: 'Open',
  },
  {
    id: 2,
    date: '05-03-2024',
    name: '100 Loxodonta Africana',
    revenue: 1000,
    material: 2000,
    status: 'Open',
  },
  {
    id: 3,
    date: '05-03-2024',
    name: '100 Loxodonta Africana',
    revenue: 1000,
    material: 2000,
    status: 'Open',
  },
  {
    id: 4,
    date: '05-03-2024',
    name: '100 Loxodonta Africana',
    revenue: 1000,
    material: 2000,
    status: 'Open',
  },
  {
    id: 5,
    date: '05-03-2024',
    name: '100 Loxodonta Africana',
    revenue: 1000,
    material: 2000,
    status: 'Open',
  },
]);
</script>

<style lang="scss" scoped></style>
