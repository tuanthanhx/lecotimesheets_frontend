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
      <v-data-table :headers="headers" :items="items" :items-per-page="-1">
        <template v-slot:[`item.break`]="{ item }">
          <v-icon v-if="item.break" icon="mdi-check-circle" />
        </template>
        <template #bottom></template>
      </v-data-table>
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

const statuses = ref([
  {
    id: 1,
    name: 'Approved',
  },
  {
    id: 2,
    name: 'Confirming',
  },
]);

const search = () => {
  console.log('comming soon');
};


const headers = ref([
  { title: 'Date', value: 'date', width: 140 },
  { title: 'Job', value: 'job', width: 'auto' },
  { title: 'Time', value: 'time', width: 140 },
  { title: 'Break', value: 'break', width: 140 },
  { title: 'Time Worked', value: 'timeworked', width: 140 },
  { title: 'Status', value: 'status', width: 140 },
]);
const items = ref([
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 1,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 2,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: false,
    timeworked: '9h30m',
    status: 'Approved',
  },
  {
    id: 3,
    date: '05-03-2024',
    job: '100 Loxodonta Africana',
    member: 'John Smith',
    time: '08:00 - 16:00',
    break: true,
    timeworked: '9h30m',
    status: 'Approved',
  },
]);

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped>
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>
