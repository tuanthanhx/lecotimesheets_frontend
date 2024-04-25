<template>
  <v-dialog v-model="isModalVisible" max-width="1200px">
    <v-card class="pa-4">
      <v-card-text style="background:orange;" class="pa-0">
        <v-data-table :headers="headers" :items="items" :items-per-page="-1">
          <template v-slot:[`item.break`]="{ item }">
            <v-icon v-if="item.break" icon="mdi-check-circle" />
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="mt-4 justify-center">
        <v-btn class="text-none" variant="elevated" width="120" height="40" color="#2B343F"
          @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['closeModal']);

const isModalVisible = ref(false);

defineProps({
  selectedDessert: null,
});

const closeModal = () => {
  emit('closeModal');
};

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
]);
</script>
