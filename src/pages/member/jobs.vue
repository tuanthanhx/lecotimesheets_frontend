<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <v-row>
      <v-col cols="auto">
        <h1 class="text-h5 pt-2 pt-sm-0 mb-4 mb-sm-8">Jobs</h1>
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
        <template v-slot:[`item.name`]="{ item }">
          <span class="cursor-pointer" @click="openModalJobDetail(item)">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.dob`]="{ item }">
          {{ item.dob ? formatDateString(item.dob) : '' }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
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
                <v-list-item-title>Detail</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-sheet>

    <ModalJobDetail v-model="isModalJobDetailVisible" @close="closeModalJobDetail" :item="viewItem" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';

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

const isModalJobDetailVisible = ref(false);
const viewItem = ref(null);

const openModalJobDetail = (item) => {
  viewItem.value = item;
  isModalJobDetailVisible.value = true;
};

const closeModalJobDetail = () => {
  isModalJobDetailVisible.value = false;
};
</script>

<style lang="scss" scoped></style>
