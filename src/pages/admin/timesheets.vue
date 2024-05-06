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
                :items="members"
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
          <v-btn class="text-none" style="margin-top: 30px" prepend-icon="mdi-plus" width="160" height="40" color="#2B343F" @click="null"> Add Time </v-btn>
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
        <!--
        <template v-slot:[`item.name`]="{ item }">
          <span class="cursor-pointer" @click="openModalMemberDetail(item)">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.dob`]="{ item }">
          {{ item.dob ? formatDateString(item.dob) : '' }}
        </template>
        -->
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          {{ item.status === 1 ? 'Confirming' : 'Approved' }}
        </template>
        <template v-slot:[`item.time_range`]="{ item }"> todo 1 </template>
        <template v-slot:[`item.break`]="{ item }">
          <v-icon v-if="item.break" icon="mdi-check-circle" />
        </template>
        <template v-slot:[`item.time_worked`]="{ item }"> todo 2 </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
            </template>
            <v-list>
              <v-list-item link @click="openModalMemberDetail(item)">
                <v-list-item-title>Detail</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="openModalMemberEdit(item)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="activateMember(item)" v-if="item.status === 2">
                <v-list-item-title>Activate</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="deactivateMember(item)" v-if="item.status === 1">
                <v-list-item-title>Deactivate</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="deleteMember(item)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-sheet>

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
import { formatDateString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';
import { useConfirmDialog } from '@/plugins/confirm_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showInfo } = useMessageDialog();
const { isConfirmDialogVisible, confirmTitle, confirmMessage, confirmButtonText, cancelButtonText, showConfirm, confirm, cancel } = useConfirmDialog();

const searchJob = ref(null);
const searchMember = ref(null);
const searchStatus = ref(null);

const jobs = ref([
  {
    id: 1,
    name: '100 Lorem Ipsum',
  },
  {
    id: 2,
    name: '101 Lorem Ipsum',
  },
]);

const members = ref([
  {
    id: 1,
    name: 'John Smith',
  },
  {
    id: 2,
    name: 'Nancy Anderson',
  },
]);

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
  itemsPerPage: 10,
});
const tableHeaders = ref([
  { title: 'Created On', value: 'created_at', width: 120 },
  { title: 'Member', value: 'user.name', width: 200 },
  { title: 'Job', value: 'job.name', width: 'auto' },
  { title: 'Time', value: 'time_range', width: 120 },
  { title: 'Break', value: 'break', width: 120 },
  { title: 'Time Worked', value: 'time_worked', width: 120 },
  { title: 'Status', value: 'status', width: 120 },
  { title: '', value: 'actions', width: 80 },
]);

const search = async (options = tableOptions.value) => {
  tableLoading.value = true;
  try {
    const response = await axios.get(`/timesheets?page=${options.page}&limit=${options.itemsPerPage}&keyword=&job=&user=&status=${searchStatus.value ?? ''}`);
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

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped></style>
