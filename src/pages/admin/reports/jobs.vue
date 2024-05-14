<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Job Reports</h1>

    <h3 class="text-subtitle-2 mb-2">Select Job</h3>
    <v-select
      style="width: 300px"
      variant="solo"
      density="compact"
      clearable
      v-model="selectedJob"
      :items="jobs"
      item-title="name"
      :item-value="(item) => item"
      placeholder="Select a job"
      @update:modelValue="() => fetchTimesheets()"
    ></v-select>

    <v-sheet v-show="!selectedJob" class="pa-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
        <v-card-text class="text-center">
          <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
          <p class="mt-4">Select a job to analyze data</p>
        </v-card-text>
      </v-card>
    </v-sheet>

    <v-sheet v-show="selectedJob" class="pa-8 mb-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <pre> revenue: {{ formatCurrencyString(job.revenue) }} </pre>
      <pre> material_cost: {{ formatCurrencyString(job.material_cost) }} </pre>
      <pre> labour_cost: {{ formatCurrencyString(totalAmount) }}, unpaid: {{ formatCurrencyString(unpaidAmount) }} </pre>
      <pre> profit: {{ formatCurrencyString(job.revenue - job.material_cost - totalAmount) }} </pre>
      <!-- Revenue: $50,000<br />
        Material Costs: $10,000<br />
        Labor Costs: $20,000 (Paid: $15,000, Unpaid: $5,000)<br />
        Profit: $20,000 -->
    </v-sheet>

    <v-sheet v-show="selectedJob" class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
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
            <v-chip min-width="100" size="small" color="#1e88c9" variant="flat" prepend-icon="mdi-sync">Pending</v-chip>
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString, sortArray } from '@/plugins/utils';

const job = ref({});
const jobs = ref([]);
const selectedJob = ref(null);
const totalAmount = ref(0);
const unpaidAmount = ref(0);

const fetchJobs = async () => {
  try {
    const listJobs = await axios.get('/jobs?type=select&limit=-1');
    if (listJobs?.data?.data) {
      jobs.value = sortArray(listJobs.data.data, 'name');
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
  { title: 'Member', value: 'user.name', width: '100%', minWidth: 200 },
  { title: 'Date', value: 'date', minWidth: 110 },
  { title: 'Time', value: 'time_range', minWidth: 120 },
  { title: 'Break', value: 'break' },
  { title: 'Duration', value: 'time_worked', minWidth: 110 },
  { title: 'Rate', value: 'hourly_rate', align: 'end' },
  { title: 'Amount', value: 'amount', minWidth: 110, align: 'end' },
  { title: 'Status', value: 'status' },
]);

const fetchTimesheets = async (options = tableOptions.value) => {
  if (!selectedJob.value) {
    timesheets.value = [];
    return;
  }

  tableLoading.value = true;
  try {
    const response = await axios.get(`/timesheets?type=report&page=${options.page}&limit=${options.itemsPerPage}&job=${selectedJob.value?.id ?? ''}`);
    const responseAmount = await axios.get(`/timesheets/amount?job=${selectedJob.value?.id ?? ''}`);
    const responseJob = await axios.get(`/jobs/${selectedJob.value?.id}`);
    if (response?.data?.data) {
      timesheets.value = response.data.data;
      tableTotalItems.value = response.data.total;
      tableOptions.value.page = options.page;
      tableOptions.value.itemsPerPage = options.itemsPerPage;
    }
    totalAmount.value = responseAmount?.data?.totalAmount;
    unpaidAmount.value = responseAmount?.data?.unpaidAmount;
    if (responseJob?.data) {
      job.value = responseJob.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

onMounted(() => {
  fetchJobs();
});
</script>

<style lang="scss" scoped></style>
