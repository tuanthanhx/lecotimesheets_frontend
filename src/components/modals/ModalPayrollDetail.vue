<template>
  <v-dialog v-model="isModalVisible" max-width="1200px">
    <v-card class="pa-4">
      <v-card-text class="pa-0">
        {{ props.item }}
        <v-data-table :headers="tableHeaders" :items="viewItem" :items-per-page="-1" :hover="true">
          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDateString(item.created_at) }}
          </template>
          <template v-slot:[`item.date`]="{ item }">
            {{ formatDateString(item.date) }}
          </template>
          <template v-slot:[`item.time_range`]="{ item }"> {{ formatTimeString(item.start_time) }} - {{ formatTimeString(item.end_time) }} </template>
          <template v-slot:[`item.break`]="{ item }"><v-icon v-if="item.break" icon="mdi-check-circle" /></template>
          <template v-slot:[`item.time_worked`]="{ item }">
            {{ formatHourString(item.time_worked) }}
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            {{ formatCurrencyString(item.amount) }}
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="mt-4 justify-center">
        <v-btn class="text-none" variant="elevated" width="120" height="40" color="#2B343F" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString } from '@/plugins/utils';

const emit = defineEmits(['close']);

const props = defineProps({
  timesheets: Object,
});

const viewItem = ref([]);
viewItem.value = props.timesheets?.length ? [...props.timesheets] : [];

const isModalVisible = ref(false);

watch(
  () => props.timesheets,
  (newValue) => {
    viewItem.value = [...newValue];
  },
);

const closeModal = () => {
  emit('close');
};

const tableHeaders = ref([
  { title: 'Job', value: 'job.name', width: 'auto' },
  { title: 'Date', value: 'date', width: 120 },
  { title: 'Time', value: 'time_range', width: 120 },
  { title: 'Break', value: 'break', width: 120 },
  { title: 'Time Worked', value: 'time_worked', width: 130 },
  { title: 'Hourly Rate', value: 'hourly_rate', width: 120 },
  { title: 'Amount', value: 'amount', width: 120 },
]);
</script>
