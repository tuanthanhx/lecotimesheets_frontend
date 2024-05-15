<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <h1 class="text-h5 mb-8">Job Reports</h1>

    <v-row class="mb-4 section-filters">
      <v-col cols="12" sm="auto">
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
          hide-details
          @update:modelValue="() => fetchTimesheets()"
        ></v-select>
      </v-col>
    </v-row>

    <v-sheet v-show="!selectedJob" class="pa-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
        <v-card-text class="text-center">
          <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
          <p class="mt-4">Select a job to analyze data</p>
        </v-card-text>
      </v-card>
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

    <v-sheet v-show="selectedJob && job.revenue" class="pa-8 mt-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-row>
        <v-col cols="12" md="6" order-md="last">
          <Doughnut :data="chartData" :options="chartOptions" />
        </v-col>
        <v-col cols="12" md="6">
          <v-row class="mb-2">
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Revenue</h3>
              <span class="text-h5">{{ formatCurrencyString(job.revenue) }}</span>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Material Cost</h3>
              <span class="text-h5">{{ formatCurrencyString(job.material_cost) }}</span>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12" md="auto">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Labour Cost</h3>
              <span class="text-h5">{{ formatCurrencyString(totalAmount) }}</span>
            </v-col>
            <v-col cols="12" md="auto" class="ml-16">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Paid</h3>
              <span class="text-h5">{{ formatCurrencyString(paidAmount) }}</span>
            </v-col>
            <v-col cols="12" md="auto" class="ml-16">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Unpaid</h3>
              <span class="text-h5">{{ formatCurrencyString(unpaidAmount) }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2" style="color: #888">Profit</h3>
              <span class="text-h5">{{ formatCurrencyString(job.revenue - job.material_cost - totalAmount) }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString, sortArray } from '@/plugins/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const job = ref({});
const jobs = ref([]);
const selectedJob = ref(null);
const totalAmount = ref(0);
const paidAmount = ref(0);
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
    paidAmount.value = responseAmount?.data?.paidAmount;
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

const chartData = computed(() => ({
  labels: ['Material Cost', 'Labour Cost (Paid)', 'Labour Cost (Unpaid)', 'Profit'],
  datasets: [
    {
      backgroundColor: ['#66BB6A', '#FFA726', '#FF7043', '#42A5F5'],
      data: [job.value.material_cost, paidAmount.value, unpaidAmount.value, job.value.revenue - job.value.material_cost - totalAmount.value],
    },
  ],
}));

ChartJS.register({
  id: 'centerText',
  beforeInit: (chart) => {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  animation: {
    duration: 0,
  },
  layout: {
    padding: {
      top: 0,
      bottom: 0,
    },
  },
});

onMounted(() => {
  fetchJobs();
});
</script>

<style lang="scss" scoped></style>
