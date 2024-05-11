<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Timesheets</h1>
    <v-sheet class="mb-2" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <!--
            // TODO : Add Date Range later
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2">Date Range</h3>
              <p>UPDATING</p>
            </v-col> -->

            <v-col cols="auto">
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
                @update:modelValue="() => search()"
              ></v-select>
            </v-col>
            <v-col cols="auto">
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
                @update:modelValue="() => search()"
              ></v-select>
            </v-col>
            <v-col cols="auto">
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
                @update:modelValue="() => search()"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn class="text-none" style="margin-top: 30px" prepend-icon="mdi-plus" width="160" height="40" color="#2B343F" @click="openModalTimesheetAdd">
            Add Time
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table-server
        v-model:items-per-page="tableOptions.itemsPerPage"
        :headers="tableHeaders"
        :items="timesheets"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="name"
        @update:options="search"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <template v-if="item.status === 1">Confirming</template>
          <template v-else-if="item.status === 2">Approved</template>
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
import { formatDateString, formatTimeString, formatCurrencyString, totalHours, sortArray } from '@/plugins/utils';
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
    name: 'Confirming',
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
  { title: 'Submitted On', value: 'created_at', width: 120 },
  { title: 'Member', value: 'user.name', width: 200 },
  { title: 'Job', value: 'job.name', width: 'auto' },
  { title: 'Date', value: 'date', width: 120 },
  { title: 'Time', value: 'time_range', width: 120 },
  { title: 'Break', value: 'break', width: 120 },
  { title: 'Time Worked', value: 'time_worked.text', width: 120 },
  { title: 'Hourly Rate', value: 'hourly_rate', width: 120 },
  { title: 'Wage', value: 'amount', width: 120 },
  { title: 'Status', value: 'status', width: 120 },
  { title: '', value: 'actions', width: 80 },
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
    const listJobs = await axios.get('/jobs?type=select&limit=-1');
    if (listJobs?.data?.data) {
      jobs.value = sortArray(listJobs.data.data, 'name');
    }
    const listUsers = await axios.get('/users?type=select&limit=-1');
    if (listUsers?.data?.data) {
      users.value = sortArray(listUsers.data.data, 'name');
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
  search();
});
</script>

<style lang="scss" scoped></style>
