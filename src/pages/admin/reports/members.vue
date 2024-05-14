<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Member Reports</h1>

    <v-row>
      <v-col cols="auto">
        <h3 class="text-subtitle-2 mb-2">Select Member</h3>
        <v-select
          style="width: 300px"
          variant="solo"
          density="compact"
          clearable
          v-model="selectedUser"
          :items="users"
          item-title="name"
          :item-value="(item) => item"
          placeholder="Select a member"
          @update:modelValue="() => fetchTimesheets()"
        ></v-select>
      </v-col>
    </v-row>

    <v-sheet v-show="!selectedUser" class="pa-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
        <v-card-text class="text-center">
          <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
          <p class="mt-4">Select a member to analyze data</p>
        </v-card-text>
      </v-card>
    </v-sheet>

    <v-sheet v-show="selectedUser" class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-data-table-server
        v-model:items-per-page="tableOptions.itemsPerPage"
        :headers="tableHeaders"
        :items="timesheets"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="name"
        :hover="true"
        @update:options="fetchTimesheets"
      >
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
        <template v-slot:[`item.status`]="{ item }">
          <template v-if="item.status === 1">
            <v-chip min-width="100" size="small" color="#1e88c9" variant="flat" prepend-icon="mdi-sync">In review</v-chip>
          </template>
          <template v-else-if="item.status === 2">
            <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-checkbox-marked-circle">Approved</v-chip>
          </template>
          <template v-else-if="item.status === 3">
            <v-chip min-width="100" size="small" color="#e91e63" variant="flat" prepend-icon="mdi-currency-usd">Paid</v-chip>
          </template>
        </template>
      </v-data-table-server>
    </v-sheet>

    <v-sheet v-show="selectedUser && timesheets && totalAmount" class="pa-8 mt-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-row class="mb-2">
        <v-col cols="auto" class="mr-16">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Total Amount</h3>
          <span class="text-h5">{{ formatCurrencyString(totalAmount) }}</span>
        </v-col>
        <v-col cols="auto" class="mr-16">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Paid</h3>
          <span class="text-h5">{{ formatCurrencyString(paidAmount) }}</span>
        </v-col>
        <v-col cols="auto">
          <h3 class="text-subtitle-2 mb-2" style="color: #888">Unpaid</h3>
          <span class="text-h5">{{ formatCurrencyString(unpaidAmount) }}</span>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString, sortArray } from '@/plugins/utils';

const users = ref([]);
const selectedUser = ref(null);
const totalAmount = ref(0);
const paidAmount = ref(0);
const unpaidAmount = ref(0);

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

const timesheets = ref([]);

const tableLoading = ref(true);
const tableTotalItems = ref(0);
const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
});

const tableHeaders = ref([
  { title: 'Member', value: 'user.name', minWidth: 150 },
  { title: 'Job', value: 'job.name', width: '100%', minWidth: 200 },
  { title: 'Date', value: 'date', minWidth: 110 },
  { title: 'Time', value: 'time_range', minWidth: 120 },
  { title: 'Break', value: 'break' },
  { title: 'Duration', value: 'time_worked' },
  { title: 'Rate', value: 'hourly_rate', align: 'end' },
  { title: 'Amount', value: 'amount', align: 'end' },
  { title: 'Status', value: 'status' },
]);

const fetchTimesheets = async (options = tableOptions.value) => {
  if (!selectedUser.value) {
    timesheets.value = [];
    return;
  }

  tableLoading.value = true;
  try {
    const response = await axios.get(`/timesheets?type=report&page=${options.page}&limit=${options.itemsPerPage}&user=${selectedUser.value?.id ?? ''}`);
    const responseAmount = await axios.get(`/timesheets/amount?user=${selectedUser.value?.id ?? ''}`);
    if (response?.data?.data) {
      timesheets.value = response.data.data;
      tableTotalItems.value = response.data.total;
      tableOptions.value.page = options.page;
      tableOptions.value.itemsPerPage = options.itemsPerPage;
    }
    totalAmount.value = responseAmount?.data?.totalAmount;
    paidAmount.value = responseAmount?.data?.paidAmount;
    unpaidAmount.value = responseAmount?.data?.unpaidAmount;
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style lang="scss" scoped></style>
