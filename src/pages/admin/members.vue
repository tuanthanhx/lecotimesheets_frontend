<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Members</h1>
    <v-sheet class="mb-2" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2">Keyword</h3>
              <v-text-field
                style="width: 300px"
                variant="solo"
                density="compact"
                clearable
                append-inner-icon="mdi-magnify"
                v-model="searchKeyword"
                placeholder="Search items"
                @update:modelValue="search"
              ></v-text-field>
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
                @update:modelValue="search"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn class="text-none" style="margin-top: 30px" prepend-icon="mdi-plus" width="160" height="40" color="#2B343F" @click="openModalMemberAdd"> Add Member </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table :headers="headers" :items="members" v-model:options="options" :items-per-page="options.itemsPerPage" v-model:page="options.page">
        <template v-slot:[`item.dob`]="{ item }">
          {{ item.dob ? formatDateString(item.dob) : '' }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          {{ item.status === 1 ? 'Active' : 'Deactivated' }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
            </template>
            <v-list>
              <v-list-item link>
                <v-list-item-title>Detail</v-list-item-title>
              </v-list-item>
              <v-list-item link>
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
      </v-data-table>
    </v-sheet>

    <ModalMemberAdd v-model="isModalMemberAddVisible" @submit="submitModalMemberAdd" @close="closeModalMemberAdd" />
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

const headers = ref([
  { title: 'Created On', value: 'created_at', width: 120 },
  { title: 'Login', value: 'username', width: 140 },
  { title: 'Full Name', value: 'name', width: 'auto' },
  { title: 'Hourly Rate', value: 'hourly_rate', width: 120 },
  { title: 'Status', value: 'status', width: 120 },
  { title: '', value: 'actions', width: 80 },
]);

const searchKeyword = ref('');
const searchStatus = ref(null);

const statuses = ref([
  {
    id: 1,
    name: 'Active',
  },
  {
    id: 2,
    name: 'Deactivated',
  },
]);

const members = ref([]);
const totalItems = ref(0);
const options = ref({
  page: 1,
  itemsPerPage: 25,
});

const goToLastPage = () => {
  const lastPage = Math.ceil(totalItems.value / options.value.itemsPerPage);
  options.value.page = lastPage;
};

const isModalMemberAddVisible = ref(false);

const openModalMemberAdd = () => {
  isModalMemberAddVisible.value = true;
};

const submitModalMemberAdd = () => {
  isModalMemberAddVisible.value = false;
  search();
  goToLastPage();
  showInfo('A new member has been added.', null);
};

const closeModalMemberAdd = () => {
  isModalMemberAddVisible.value = false;
};

const search = async () => {
  try {
    const response = await axios.get(`/users?keyword=${searchKeyword.value || ''}&status=${searchStatus.value ?? ''}`);
    if (response?.data) {
      members.value = response.data;
      totalItems.value = response.data.length;
    }
  } catch (error) {
    console.error(error);
  }
};

const activateMember = async (item) => {
  try {
    await axios.post(`/users/${item.id}/activate`);
    search();
    showInfo('The selected member has been activated.', null);
  } catch (error) {
    console.error(error);
  }
};

const deactivateMember = async (item) => {
  try {
    await axios.post(`/users/${item.id}/deactivate`);
    search();
    showInfo('The selected member has been deactivated.', null);
  } catch (error) {
    console.error(error);
  }
};

const deleteMember = async (item) => {
  showConfirm({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${item.name}? \nThis action cannot be undone.`,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    onConfirm: () => {
      confirmDeleteMember(item);
    },
  });
};

const confirmDeleteMember = async (item) => {
  try {
    await axios.delete(`/users/${item.id}`);
    search();
    showInfo('The selected member has been deleted.', null);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped></style>
