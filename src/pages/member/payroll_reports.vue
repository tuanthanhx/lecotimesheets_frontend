<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Payroll Reports</h1>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-data-table :headers="tableHeaders" :items="payrolls" :items-per-page="25" :hover="true">
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          {{ formatCurrencyString(item.amount) }}
        </template>
        <template v-slot:[`item.time_worked`]="{ item }">
          {{ formatHourString(item.time_worked) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="text-none" @click="openModalPayrollDetail(item)" color="#2b343f" height="32">Timesheets</v-btn>
        </template>
      </v-data-table>
    </v-sheet>

    <ModalPayrollDetail v-model="isModalPayrollDetailVisible" @close="closeModalPayrollDetail" :timesheets="viewItem" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatHourString, formatCurrencyString } from '@/plugins/utils';

const payrolls = ref([]);

const fetchPayrolls = async () => {
  try {
    const response = await axios.get(`/payrolls`);
    if (response?.data?.data) {
      payrolls.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const tableHeaders = ref([
  { title: 'Pay Date', value: 'created_at', minWidth: 140 },
  { title: 'Duration', value: 'time_worked', minWidth: 110 },
  { title: 'Amount', value: 'amount', minWidth: 110, align: 'end' },
  { title: '', value: '', width: '100%' },
  { title: '', value: 'actions' },
]);

const isModalPayrollDetailVisible = ref(false);
const viewItem = ref(null);

const openModalPayrollDetail = (item) => {
  viewItem.value = item.timesheets;
  isModalPayrollDetailVisible.value = true;
};

const closeModalPayrollDetail = () => {
  isModalPayrollDetailVisible.value = false;
};

onMounted(() => {
  fetchPayrolls();
});
</script>

<style lang="scss" scoped></style>
