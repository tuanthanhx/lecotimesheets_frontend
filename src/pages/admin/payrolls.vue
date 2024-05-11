<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Payrolls</h1>

    <v-row>
      <v-col cols="auto">
        <v-select
          style="width: 300px"
          variant="solo"
          clearable
          label="Select Member"
          v-model="selectedUser"
          :items="users"
          item-title="name"
          :item-value="(item) => item"
          @update:modelValue="() => estimate()"
        ></v-select>
      </v-col>
      <v-col cols="auto" class="d-flex ml-auto" v-if="selectedUser">
        <div class="mt-2 mr-4 text-right">
          <pre> totalTimeWorked: {{ totalTimeWorked }} </pre>
          <pre> totalAmount: {{ totalAmount }} </pre>
        </div>
        <v-btn class="text-none" prepend-icon="mdi-currency-usd" width="160" height="56" color="#2B343F" @click="payWages"> Pay now </v-btn>
      </v-col>
    </v-row>

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
      <h2 class="text-h6 mb-4">{{ selectedUser?.name }}</h2>
      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
        <v-data-table :headers="tableHeaders" :items="timesheets" :items-per-page="-1">
          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDateString(item.created_at) }}
          </template>
          <template v-slot:[`item.date`]="{ item }">
            {{ formatDateString(item.date) }}
          </template>
          <template v-slot:[`item.time_range`]="{ item }"> {{ formatTimeString(item.start_time) }} - {{ formatTimeString(item.end_time) }} </template>
          <template v-slot:[`item.break`]="{ item }"><v-icon v-if="item.break" icon="mdi-check-circle" /></template>
          <template v-slot:[`item.amount`]="{ item }">
            {{ formatCurrencyString(item.amount) }}
          </template>
          <template #bottom></template>
        </v-data-table>
      </v-sheet>
    </template>

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

const { isMessageDialogVisible, messageTitle, messageText, messageType, showInfo, showError } = useMessageDialog();
const { isConfirmDialogVisible, confirmTitle, confirmMessage, confirmButtonText, cancelButtonText, showConfirm, confirm, cancel } = useConfirmDialog();

const timesheets = ref([]);
const users = ref([]);
const selectedUser = ref(null);
const totalTimeWorked = ref(0);
const totalAmount = ref(0);

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

const estimate = async () => {
  try {
    const response = await axios.get(`/timesheets?type=approved&limit=-1&user=${selectedUser.value?.id}`);
    if (response?.data?.data) {
      timesheets.value = response.data.data;
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
      totalTimeWorked.value = timesheets.value.reduce((total, item) => total + item.time_worked?.count, 0);
      totalAmount.value = timesheets.value.reduce((total, item) => total + item.amount, 0);
    }
  } catch (error) {
    console.error(error);
  }
};

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
]);

const payWages = async (item) => {
  showConfirm({
    title: 'Confirm Payment',
    message: `Are you sure you want to pay this payroll?`,
    confirmButtonText: 'Pay',
    cancelButtonText: 'Cancel',
    onConfirm: () => {
      confirmPayWages(item);
    },
  });
};

const confirmPayWages = async () => {
  try {
    const object = {
      user_id: selectedUser.value.id,
      amount: totalAmount.value,
      time_worked: totalTimeWorked.value,
    };
    await axios.post('/payrolls', object);
    showInfo('The payroll has been paid.\nYou can find the payment history in the Payroll Reports.', null);
    estimate();
  } catch (error) {
    showError(error.response?.data?.message, null);
    console.error(error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style lang="scss" scoped></style>
