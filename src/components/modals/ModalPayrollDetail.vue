<template>
  <v-dialog v-model="isModalVisible" max-width="960px">
    <v-card class="pa-4">
      <v-card-text class="pa-0">
        <v-data-table :headers="tableHeaders" :items="viewItem" :items-per-page="-1" :hover="true">
          <template #[`item.created_at`]="{ item }">
            {{ formatDateString(item.created_at) }}
          </template>
          <template #[`item.date`]="{ item }">
            {{ formatDateString(item.date) }}
          </template>
          <template #[`item.time_range`]="{ item }"> {{ formatTimeString(item.start_time) }} - {{ formatTimeString(item.end_time) }} </template>
          <template #[`item.break`]="{ item }">
            <v-icon v-if="item.break" icon="mdi-check-circle" />
            <v-icon v-else icon="mdi-checkbox-blank-circle-outline" />
          </template>
          <template #[`item.time_worked`]="{ item }">
            {{ formatHourString(item.time_worked) }}
          </template>
          <template #[`item.hourly_rate`]="{ item }">
            {{ formatCurrencyString(item.hourly_rate) }}
          </template>
          <template #[`item.amount`]="{ item }">
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

const emit = defineEmits(['close', 'update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  timesheets: {
    type: Array,
    default: () => [],
  },
});

const viewItem = ref([]);
viewItem.value = props.timesheets?.length ? [...props.timesheets] : [];

const isModalVisible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isModalVisible.value = newValue;
  },
);

watch(
  () => props.timesheets,
  (newValue) => {
    viewItem.value = [...newValue];
  },
);

watch(isModalVisible, (newValue) => {
  emit('update:modelValue', newValue);
});

const closeModal = () => {
  isModalVisible.value = false;
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
