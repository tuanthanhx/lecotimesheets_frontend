<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Payrolls</h1>

    <v-row class="mb-4 section-filters">
      <v-col cols="12" sm="auto">
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
          hide-details
          @update:modelValue="() => estimate()"
        ></v-select>
      </v-col>
      <v-col cols="auto" class="ml-auto" v-if="selectedUser && timesheets.length">
        <v-btn class="button-pay text-none" prepend-icon="mdi-currency-usd" width="160" height="40" color="#2b343f" @click="payWages"> Pay now </v-btn>
      </v-col>
    </v-row>

    <template v-if="!selectedUser">
      <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
        <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
          <v-card-text class="text-center">
            <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
            <p class="mt-4">Select a member to analyze data</p>
          </v-card-text>
        </v-card>
      </v-sheet>
    </template>

    <template v-else>
      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg" elevation="2">
        <v-data-table :headers="tableHeaders" :items="timesheets" :items-per-page="-1">
          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDateString(item.created_at) }}
          </template>
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
          <template v-slot:[`body.append`]>
            <tr class="font-weight-bold">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ formatHourString(totalTimeWorked) }}</td>
              <td></td>
              <td class="text-right">{{ formatCurrencyString(totalAmount) }}</td>
            </tr>
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
import { formatDateString, formatTimeString, formatCurrencyString, formatHourString, sortArray } from '@/plugins/utils';
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
  if (!selectedUser.value) {
    timesheets.value = [];
    totalTimeWorked.value = 0;
    totalAmount.value = 0;
    return;
  }
  try {
    const response = await axios.get(`/timesheets?type=approved&limit=-1&user=${selectedUser.value?.id}`);
    if (response?.data?.data) {
      timesheets.value = response.data.data;
      totalTimeWorked.value = timesheets.value.reduce((total, item) => total + item.time_worked, 0);
      totalAmount.value = timesheets.value.reduce((total, item) => total + item.amount, 0);
    }
  } catch (error) {
    console.error(error);
  }
};

const tableHeaders = ref([
  { title: 'Job', value: 'job.name', width: '100%', minWidth: 200 },
  { title: 'Date', value: 'date', minWidth: 110 },
  { title: 'Time', value: 'time_range', minWidth: 120 },
  { title: 'Break', value: 'break' },
  { title: 'Duration', value: 'time_worked', minWidth: 120 },
  { title: 'Rate', value: 'hourly_rate', align: 'end' },
  { title: 'Amount', value: 'amount', minWidth: 120, align: 'end' },
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
