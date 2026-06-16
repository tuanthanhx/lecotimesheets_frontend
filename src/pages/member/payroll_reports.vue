<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <v-row>
      <v-col cols="auto">
        <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Payroll Reports</h1>
      </v-col>
    </v-row>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-data-table :headers="tableHeaders" :items="payrolls" :items-per-page="25" :hover="true">
        <template #[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template #[`item.amount`]="{ item }">
          {{ formatCurrencyString(item.amount) }}
        </template>
        <template #[`item.time_worked`]="{ item }">
          {{ formatHourString(item.time_worked) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn class="text-none" color="#2b343f" height="32" @click="openModalPayrollDetail(item)">Timesheets</v-btn>
        </template>
      </v-data-table>
    </v-sheet>

    <v-sheet class="pa-8 mt-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-row class="mb-2">
        <v-col cols="12" md="auto" class="mr-md-16">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Total Amount</h3>
          <span class="text-h5">{{ formatCurrencyString(totalAmount) }}</span>
        </v-col>
        <v-col cols="12" md="auto" class="mr-md-16">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Paid</h3>
          <span class="text-h5">{{ formatCurrencyString(paidAmount) }}</span>
        </v-col>
        <v-col cols="12" md="auto">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Unpaid</h3>
          <span class="text-h5">{{ formatCurrencyString(unpaidAmount) }}</span>
        </v-col>
      </v-row>
    </v-sheet>

    <ModalPayrollDetail v-model="isModalPayrollDetailVisible" :timesheets="viewItem" @close="closeModalPayrollDetail" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatHourString, formatCurrencyString } from '@/plugins/utils';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const payrolls = ref([]);
const totalAmount = ref(0);
const paidAmount = ref(0);
const unpaidAmount = ref(0);

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

const fetchAmounts = async () => {
  const userId = userStore.userData?.id;
  if (!userId) {
    return;
  }

  try {
    const response = await axios.get(`/timesheets/amount?user=${userId}`);
    totalAmount.value = response?.data?.totalAmount ?? 0;
    paidAmount.value = response?.data?.paidAmount ?? 0;
    unpaidAmount.value = response?.data?.unpaidAmount ?? 0;
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
  fetchAmounts();
});
</script>

<style lang="scss" scoped></style>
