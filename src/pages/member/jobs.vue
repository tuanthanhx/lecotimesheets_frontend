<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Jobs</h1>
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
                placeholder="Search jobs"
                @update:modelValue="() => search()"
              ></v-text-field>
            </v-col>
            <!-- TODO: Add this filter later
            <v-col cols="auto">
              <h3 class="text-subtitle-2 mb-2">Date range</h3>
              <v-text-field></v-text-field>
            </v-col> -->
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
      </v-row>
    </v-sheet>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table-server
        v-model:items-per-page="tableOptions.itemsPerPage"
        :headers="tableHeaders"
        :items="jobs"
        :items-length="tableTotalItems"
        :loading="tableLoading"
        item-value="name"
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
          {{ item.status === 1 ? 'Open' : 'Close' }}
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
import { ref, onMounted } from 'vue';
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
    name: 'Close',
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
  { title: 'Created On', value: 'created_at', width: 120 },
  { title: 'Job Name', value: 'name', width: 'auto' },
  { title: 'Status', value: 'status', width: 120 },
  { title: '', value: 'actions', width: 80 },
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

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped></style>
