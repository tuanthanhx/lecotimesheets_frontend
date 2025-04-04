<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <v-row>
      <v-col cols="auto">
        <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Members</h1>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          class="text-none"
          prepend-icon="mdi-plus"
          :width="$vuetify?.display?.mdAndDown ? '150' : '160'"
          height="50"
          color="#2b343f"
          @click="openModalMemberAdd"
        >
          Add Member
        </v-btn>
      </v-col>
    </v-row>
    <v-sheet class="mb-8 section-filters" color="transparent">
      <v-row>
        <v-col cols="12" sm="auto">
          <h3 class="text-subtitle-2 mb-2">Keyword</h3>
          <v-text-field
            style="width: 300px"
            variant="solo"
            density="compact"
            clearable
            append-inner-icon="mdi-magnify"
            v-model="searchKeyword"
            placeholder="Search members"
            hide-details
            @update:modelValue="() => search()"
          ></v-text-field>
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
        :items="members"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="id"
        :hover="true"
        @update:options="search"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.username`]="{ item }">
          <span class="cursor-pointer" @click="openModalMemberDetail(item)">{{ item.username }}</span>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span class="cursor-pointer" @click="openModalMemberDetail(item)">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.hourly_rate`]="{ item }">
          {{ formatCurrencyString(item.hourly_rate) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <template v-if="item.status === 1">
            <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-account-check">Active</v-chip>
          </template>
          <template v-else>
            <v-chip min-width="100" size="small" color="#606060" variant="flat" prepend-icon="mdi-account-off">Deactivated</v-chip>
          </template>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
            </template>
            <v-list>
              <v-list-item link @click="openModalMemberDetail(item)">
                <v-list-item-title>View Details</v-list-item-title>
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

    <ModalMemberAdd v-model="isModalMemberAddVisible" @submit="submitModalMemberAdd" @close="closeModalMemberAdd" />
    <ModalMemberEdit v-model="isModalMemberEditVisible" @submit="submitModalMemberEdit" @close="closeModalMemberEdit" :item="editItem" />
    <ModalMemberDetail v-model="isModalMemberDetailVisible" @close="closeModalMemberDetail" :item="viewItem" />
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
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString, formatCurrencyString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';
import { useConfirmDialog } from '@/plugins/confirm_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showInfo } = useMessageDialog();
const { isConfirmDialogVisible, confirmTitle, confirmMessage, confirmButtonText, cancelButtonText, showConfirm, confirm, cancel } = useConfirmDialog();

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

const tableLoading = ref(true);
const tableTotalItems = ref(0);
const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
});

const tableHeaders = ref([
  { title: 'Created On', value: 'created_at', minWidth: 120 },
  { title: 'Login', value: 'username', minWidth: 140 },
  { title: 'Full Name', value: 'name', width: '100%', minWidth: 200 },
  { title: 'Rate', value: 'hourly_rate', align: 'end' },
  { title: 'Status', value: 'status' },
  { title: '', value: 'actions' },
]);

const search = async (options = tableOptions.value) => {
  tableLoading.value = true;
  try {
    const response = await axios.get(
      `/users?page=${options.page}&limit=${options.itemsPerPage}&keyword=${searchKeyword.value || ''}&status=${searchStatus.value ?? ''}`,
    );
    if (response?.data?.data) {
      members.value = response.data.data;
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

const isModalMemberAddVisible = ref(false);

const openModalMemberAdd = () => {
  isModalMemberAddVisible.value = true;
};

const submitModalMemberAdd = () => {
  isModalMemberAddVisible.value = false;
  search();
  showInfo('A new member has been added.', null);
};

const closeModalMemberAdd = () => {
  isModalMemberAddVisible.value = false;
};

const isModalMemberEditVisible = ref(false);
const editItem = ref(null);

const openModalMemberEdit = (item) => {
  editItem.value = item;
  isModalMemberEditVisible.value = true;
};

const submitModalMemberEdit = () => {
  isModalMemberEditVisible.value = false;
  search();
  showInfo('The selected member has been updated.', null);
};

const closeModalMemberEdit = () => {
  isModalMemberEditVisible.value = false;
};

const isModalMemberDetailVisible = ref(false);
const viewItem = ref(null);

const openModalMemberDetail = (item) => {
  viewItem.value = item;
  isModalMemberDetailVisible.value = true;
};

const closeModalMemberDetail = () => {
  isModalMemberDetailVisible.value = false;
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
</script>

<style lang="scss" scoped></style>
