<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <v-row>
      <v-col cols="auto">
        <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Job</h1>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-btn
          class="text-none"
          prepend-icon="mdi-plus"
          :width="$vuetify?.display?.mdAndDown ? '130' : '160'"
          height="50"
          color="#2b343f"
          @click="openModalJobAdd"
        >
          Add Job
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
            placeholder="Search jobs"
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
        :items="jobs"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="id"
        :hover="true"
        @update:options="search"
      >
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span class="cursor-pointer" @click="openModalJobDetail(item)">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.revenue`]="{ item }">
          {{ formatCurrencyString(item.revenue) }}
        </template>
        <template v-slot:[`item.material_cost`]="{ item }">
          {{ formatCurrencyString(item.material_cost) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <template v-if="item.status === 1">
            <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-folder-open">Open</v-chip>
          </template>
          <template v-else>
            <v-chip min-width="100" size="small" color="#606060" variant="flat" prepend-icon="mdi-folder-lock">Closed</v-chip>
          </template>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-dots-horizontal" v-bind="props"></v-icon>
            </template>
            <v-list>
              <v-list-item link @click="openModalJobDetail(item)">
                <v-list-item-title>View Details</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="openModalJobEdit(item)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="activateJob(item)" v-if="item.status === 2">
                <v-list-item-title>Change status to "Open"</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="deactivateJob(item)" v-if="item.status === 1">
                <v-list-item-title>Change status to "Closed"</v-list-item-title>
              </v-list-item>
              <v-list-item link @click="deleteJob(item)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-sheet>

    <ModalJobAdd v-model="isModalJobAddVisible" @submit="submitModalJobAdd" @close="closeModalJobAdd" />
    <ModalJobEdit v-model="isModalJobEditVisible" @submit="submitModalJobEdit" @close="closeModalJobEdit" :item="editItem" />
    <ModalJobDetail v-model="isModalJobDetailVisible" @close="closeModalJobDetail" :item="viewItem" />
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
    name: 'Open',
  },
  {
    id: 2,
    name: 'Closed',
  },
]);

const jobs = ref([]);

const tableLoading = ref(true);
const tableTotalItems = ref(0);
const tableOptions = ref({
  page: 1,
  itemsPerPage: 25,
});

const tableHeaders = ref([
  { title: 'Created On', value: 'created_at', minWidth: 120 },
  { title: 'Job Name', value: 'name', width: '100%', minWidth: 200 },
  { title: 'Revenue', value: 'revenue', align: 'end' },
  { title: 'Material', value: 'material_cost', align: 'end' },
  { title: 'Status', value: 'status' },
  { title: '', value: 'actions' },
]);

const search = async (options = tableOptions.value) => {
  tableLoading.value = true;
  try {
    const response = await axios.get(
      `/jobs?page=${options.page}&limit=${options.itemsPerPage}&keyword=${searchKeyword.value || ''}&status=${searchStatus.value ?? ''}`,
    );
    if (response?.data?.data) {
      jobs.value = response.data.data;
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

const isModalJobAddVisible = ref(false);

const openModalJobAdd = () => {
  isModalJobAddVisible.value = true;
};

const submitModalJobAdd = () => {
  isModalJobAddVisible.value = false;
  search();
  showInfo('A new job has been added.', null);
};

const closeModalJobAdd = () => {
  isModalJobAddVisible.value = false;
};

const isModalJobEditVisible = ref(false);
const editItem = ref(null);

const openModalJobEdit = (item) => {
  editItem.value = item;
  isModalJobEditVisible.value = true;
};

const submitModalJobEdit = () => {
  isModalJobEditVisible.value = false;
  search();
  showInfo('The selected job has been updated.', null);
};

const closeModalJobEdit = () => {
  isModalJobEditVisible.value = false;
};

const isModalJobDetailVisible = ref(false);
const viewItem = ref(null);

const openModalJobDetail = (item) => {
  viewItem.value = item;
  isModalJobDetailVisible.value = true;
};

const closeModalJobDetail = () => {
  isModalJobDetailVisible.value = false;
};

const activateJob = async (item) => {
  try {
    await axios.post(`/jobs/${item.id}/activate`);
    search();
    showInfo('The selected job has been opened.', null);
  } catch (error) {
    console.error(error);
  }
};

const deactivateJob = async (item) => {
  try {
    await axios.post(`/jobs/${item.id}/deactivate`);
    search();
    showInfo('The selected job has been closed.', null);
  } catch (error) {
    console.error(error);
  }
};

const deleteJob = async (item) => {
  showConfirm({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete the selected job? \nThis action cannot be undone.`,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    onConfirm: () => {
      confirmDeleteJob(item);
    },
  });
};

const confirmDeleteJob = async (item) => {
  try {
    await axios.delete(`/jobs/${item.id}`);
    search();
    showInfo('The selected job has been deleted.', null);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped></style>
