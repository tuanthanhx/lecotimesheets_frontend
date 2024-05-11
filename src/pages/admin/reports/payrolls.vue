<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Payroll Reports</h1>

    <v-select
      style="width: 300px"
      variant="solo"
      clearable
      label="Select Member"
      v-model="selectedUser"
      :items="users"
      item-title="name"
      :item-value="(item) => item"
      @update:modelValue="() => fetchPayrolls()"
    ></v-select>

    <template v-if="!selectedUser">
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
      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
        <v-data-table :headers="tableHeaders" :items="payrolls" :items-per-page="25">
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
            <v-btn class="text-none" @click="openModalPayrollDetail(item)" color="#2B343F" height="32">Timesheets</v-btn>
          </template>
        </v-data-table>
      </v-sheet>
    </template>

    <ModalPayrollDetail v-model="isModalPayrollDetailVisible" @close="closeModalPayrollDetail" :timesheets="viewItem" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatHourString, formatCurrencyString, sortArray } from '@/plugins/utils';

const payrolls = ref([]);
const users = ref([]);
const selectedUser = ref(null);

const fetchUsers = async () => {
  try {
    const listUsers = await axios.get('/users?type=select&limit=-1');
    if (listUsers?.data?.data) {
      users.value = sortArray(listUsers.data.data, 'name');
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchPayrolls = async () => {
  if (!selectedUser.value) {
    payrolls.value = [];
    return;
  }
  try {
    const response = await axios.get(`/payrolls?user=${selectedUser.value?.id}`);
    if (response?.data?.data) {
      payrolls.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const tableHeaders = ref([
  { title: 'Pay Date', value: 'created_at', width: 140 },
  { title: 'Paid Amount', value: 'amount', width: 200 },
  { title: 'Time Worked', value: 'time_worked', width: 'auto' },
  { title: '', value: 'actions', width: 140 },
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
  fetchUsers();
});
</script>

<style lang="scss" scoped></style>
