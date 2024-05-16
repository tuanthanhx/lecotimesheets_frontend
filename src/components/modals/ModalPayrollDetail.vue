<template>
  <v-dialog v-model="isModalVisible" max-width="960px">
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
          <template v-slot:[`item.break`]="{ item }">
            <v-icon v-if="item.break" icon="mdi-check-circle" />
            <v-icon v-else icon="mdi-checkbox-blank-circle-outline" />
          </template>
          <template v-slot:[`item.time_worked`]="{ item }">
            {{ formatHourString(item.time_worked) }}
          </template>
          <template v-slot:[`item.hourly_rate`]="{ item }">
            {{ formatCurrencyString(item.hourly_rate) }}
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            {{ formatCurrencyString(item.amount) }}
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="px-4 mt-4 justify-center">
        <v-btn class="text-none" variant="elevated" width="120" height="40" color="#2b343f" @click="closeModal">Close</v-btn>
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
  { title: 'Job', value: 'job.name', width: '100%', minWidth: 200 },
  { title: 'Date', value: 'date', minWidth: 110 },
  { title: 'Time', value: 'time_range', minWidth: 120 },
  { title: 'Break', value: 'break' },
  { title: 'Duration', value: 'time_worked' },
  { title: 'Rate', value: 'hourly_rate', align: 'end' },
  { title: 'Amount', value: 'amount', align: 'end' },
]);
</script>
