<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <v-row>
      <v-col cols="auto">
        <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Timesheets</h1>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn class="text-none" prepend-icon="mdi-plus" width="160" height="50" color="#2b343f" @click="openModalTimesheetAdd"> Add Time </v-btn>
      </v-col>
    </v-row>
    <v-sheet class="mb-8 section-filters" color="transparent">
      <v-row>
        <v-col cols="12" sm="auto">
          <h3 class="text-subtitle-2 mb-2">Job</h3>
          <v-select
            style="width: 200px"
            variant="solo"
            density="compact"
            clearable
            :items="jobs"
            item-title="name"
            item-value="id"
            v-model="searchJob"
            placeholder="All jobs"
            hide-details
            @update:modelValue="() => search()"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="auto">
          <h3 class="text-subtitle-2 mb-2">Member</h3>
          <v-select
            style="width: 200px"
            variant="solo"
            density="compact"
            clearable
            :items="users"
            item-title="name"
            item-value="id"
            v-model="searchMember"
            placeholder="All members"
            hide-details
            @update:modelValue="() => search()"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="auto">
          <h3 class="text-subtitle-2 mb-2">Status</h3>
          <v-select
            style="width: 200px"
            variant="solo"
            density="compact"
            clearable
            :items="statuses"
            item-title="name"
            item-value="id"
            v-model="searchStatus"
            placeholder="All statuses"
            hide-details
            @update:modelValue="() => search()"
          ></v-select>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-data-table-server
        v-model:items-per-page="tableOptions.itemsPerPage"
        :headers="tableHeaders"
        :items="timesheets"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="id"
        :hover="true"
        :mobile="true"
        @update:options="search"
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
            </template>
            <v-list>
              <v-list-item link @click="openModalTimesheetDetail(item)">
                <v-list-item-title>View Details</v-list-item-title>
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

    <ModalTimesheetAdd
      v-model="isModalTimesheetAddVisible"
      @submit="submitModalTimesheetAdd"
      @close="closeModalTimesheetAdd"
      :users="users"
      :jobs="jobs"
      role="admin"
    />
    <ModalTimesheetEdit
      v-model="isModalTimesheetEditVisible"
      @submit="submitModalTimesheetEdit"
      @close="closeModalTimesheetEdit"
      :item="editItem"
      :users="users"
      :jobs="jobs"
      role="admin"
    />
    <ModalTimesheetDetail v-model="isModalTimesheetDetailVisible" @close="closeModalTimesheetDetail" :item="viewItem" role="admin" />
    <MessageDialog v-model="isMessageDialogVisible" :title="messageTitle" :message="messageText" :type="messageType" />
    <ConfirmDialog
      v-model="isConfirmDialogVisible"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-button-text="confirmButtonText"
      :cancel-button-text="cancelButtonText"
      @confirm="confirm"
      @cancel="cancel"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString, sortArray } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';
import { useConfirmDialog } from '@/plugins/confirm_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showInfo } = useMessageDialog();
const { isConfirmDialogVisible, confirmTitle, confirmMessage, confirmButtonText, cancelButtonText, showConfirm, confirm, cancel } = useConfirmDialog();

const searchJob = ref(null);
const searchMember = ref(null);
const searchStatus = ref(null);

const jobs = ref([]);

const users = ref([]);

const statuses = ref([
  {
    id: 1,
    name: 'In review',
  },
  {
    id: 2,
    name: 'Approved',
  },
]);

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
  { title: '', value: 'actions' },
]);

const search = async (options = tableOptions.value) => {
  tableLoading.value = true;
  try {
    const response = await axios.get(
      `/timesheets?type=unpaid&page=${options.page}&limit=${options.itemsPerPage}&job=${searchJob.value ?? ''}&user=${searchMember.value ?? ''}&status=${searchStatus.value ?? ''}`,
    );
    if (response?.data?.data) {
      timesheets.value = response.data.data;
      tableTotalItems.value = response.data.total;
      tableOptions.value.page = options.page;
      tableOptions.value.itemsPerPage = options.itemsPerPage;
    }
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
};

const isModalTimesheetAddVisible = ref(false);

const openModalTimesheetAdd = () => {
  isModalTimesheetAddVisible.value = true;
};

const submitModalTimesheetAdd = () => {
  isModalTimesheetAddVisible.value = false;
  search();
  showInfo('A new timesheet has been added.', null);
};

const closeModalTimesheetAdd = () => {
  isModalTimesheetAddVisible.value = false;
};

const isModalTimesheetEditVisible = ref(false);
const editItem = ref(null);

const openModalTimesheetEdit = (item) => {
  editItem.value = item;
  isModalTimesheetEditVisible.value = true;
};

const submitModalTimesheetEdit = () => {
  isModalTimesheetEditVisible.value = false;
  search();
  showInfo('The selected timesheet has been updated.', null);
};

const closeModalTimesheetEdit = () => {
  isModalTimesheetEditVisible.value = false;
};

const isModalTimesheetDetailVisible = ref(false);
const viewItem = ref(null);

const openModalTimesheetDetail = (item) => {
  viewItem.value = item;
  isModalTimesheetDetailVisible.value = true;
};

const closeModalTimesheetDetail = () => {
  isModalTimesheetDetailVisible.value = false;
};

const getFilters = async () => {
  try {
    const [jobsResponse, usersResponse] = await Promise.all([axios.get('/jobs?type=select&limit=-1'), axios.get('/users?type=select&limit=-1')]);

    if (jobsResponse?.data?.data) {
      const jobsObject = jobsResponse?.data?.data.map((job) => {
        if (job.status !== 1) {
          job.name = `${job.name} (Closed)`;
        }
        return job;
      });
      jobs.value = sortArray(jobsObject, 'name');
    }

    if (usersResponse?.data?.data) {
      const usersObject = usersResponse?.data?.data.map((user) => {
        if (user.status !== 1) {
          user.name = `${user.name} (Deactivated)`;
        }
        return user;
      });
      users.value = sortArray(usersObject, 'name');
    }
  } catch (error) {
    console.error(error);
  }
};

const approveTimesheet = async (item) => {
  try {
    await axios.post(`/timesheets/${item.id}/approve`);
    search();
    showInfo('The selected timesheet has been approved.', null);
  } catch (error) {
    console.error(error);
  }
};

const unapproveTimesheet = async (item) => {
  try {
    await axios.post(`/timesheets/${item.id}/unapprove`);
    search();
    showInfo('The selected timesheet has been unapproved.', null);
  } catch (error) {
    console.error(error);
  }
};

const deleteTimesheet = async (item) => {
  showConfirm({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete this record? \nThis action cannot be undone.`,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    onConfirm: () => {
      confirmDeleteTimesheet(item);
    },
  });
};

const confirmDeleteTimesheet = async (item) => {
  try {
    await axios.delete(`/timesheets/${item.id}`);
    search();
    showInfo('The selected record has been deleted.', null);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getFilters();
});
</script>

<style lang="scss" scoped></style>
