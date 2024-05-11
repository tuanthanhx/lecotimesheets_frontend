<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Job Reports</h1>

    <v-select
      style="width: 300px"
      variant="solo"
      clearable
      label="Select Job"
      v-model="selectedJob"
      :items="jobs"
      item-title="name"
      :item-value="(item) => item"
      @update:modelValue="() => fetchTimesheets()"
    ></v-select>

    <template v-if="!selectedJob">
      <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg">
        <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
          <v-card-text class="text-center">
            <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
            <p class="mt-4">Select a job to analyze data</p>
          </v-card-text>
        </v-card>
      </v-sheet>
    </template>

    <template v-else>
      <!-- <v-sheet class="pa-8 mb-4" color="#ffffff" border="sm" rounded="lg">
        Revenue: $50,000<br />
        Material Costs: $10,000<br />
        Labor Costs: $20,000 (Paid: $15,000, Unpaid: $5,000)<br />
        Profit: $20,000
      </v-sheet> -->

      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
        <v-data-table-server
          v-model:items-per-page="tableOptions.itemsPerPage"
          :headers="tableHeaders"
          :items="timesheets"
          :items-length="tableTotalItems"
          :loading="tableLoading"
          item-value="name"
          @update:options="fetchTimesheets"
        >
          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDateString(item.created_at) }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <template v-if="item.status === 1">Confirming</template>
            <template v-else-if="item.status === 2">Approved</template>
            <template v-else-if="item.status === 3">Paid</template>
            <template v-else>{{ item.status }}</template>
          </template>
          <template v-slot:[`item.date`]="{ item }">
            {{ formatDateString(item.date) }}
          </template>
          <template v-slot:[`item.time_range`]="{ item }"> {{ formatTimeString(item.start_time) }} - {{ formatTimeString(item.end_time) }} </template>
          <template v-slot:[`item.break`]="{ item }"><v-icon v-if="item.break" icon="mdi-check-circle" /></template>
          <template v-slot:[`item.amount`]="{ item }">
            {{ formatCurrencyString(item.amount) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
              </template>
              <v-list>
                <v-list-item link @click="openModalTimesheetDetail(item)">
                  <v-list-item-title>Detail</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="openModalTimesheetEdit(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="approveTimesheet(item)" v-if="item.status === 1">
                  <v-list-item-title>Approve</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="unapproveTimesheet(item)" v-if="item.status === 2">
                  <v-list-item-title>Unapprove</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="deleteTimesheet(item)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table-server>
      </v-sheet>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatTimeString, formatCurrencyString, sortArray, totalHours } from '@/plugins/utils';

const jobs = ref([]);
const selectedJob = ref(null);

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
  { title: 'Submitted On', value: 'created_at', width: 120 },
  { title: 'Member', value: 'user.name', width: 200 },
  { title: 'Date', value: 'date', width: 120 },
  { title: 'Time', value: 'time_range', width: 120 },
  { title: 'Break', value: 'break', width: 120 },
  { title: 'Time Worked', value: 'time_worked.text', width: 120 },
  { title: 'Hourly Rate', value: 'hourly_rate', width: 120 },
  { title: 'Amount', value: 'amount', width: 120 },
  { title: 'Status', value: 'status', width: 120 },
]);

const fetchTimesheets = async (options = tableOptions.value) => {
  if (!selectedJob.value) {
    timesheets.value = [];
    return;
  }

  tableLoading.value = true;
  try {
    const response = await axios.get(`/timesheets?type=report&page=${options.page}&limit=${options.itemsPerPage}&user=${selectedJob.value?.id ?? ''}`);
    if (response?.data?.data) {
      timesheets.value = response.data.data;
      tableTotalItems.value = response.data.total;
      tableOptions.value.page = options.page;
      tableOptions.value.itemsPerPage = options.itemsPerPage;
      if (timesheets.value.length) {
        timesheets.value = timesheets.value.map((item) => {
          const total = totalHours(item.start_time, item.end_time, item.break);
          return {
            ...item,
            time_worked: total,
            amount: total?.count * item.hourly_rate,
          };
        });
      }
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
