<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Members</h1>
    <v-sheet class="mb-8" color="transparent">
      <v-row>
        <v-col cols="auto">
          <v-row>
            <v-col cols="auto">
              <v-text-field
                style="width: 300px"
                dense
                variant="solo"
                clearable
                label="Search Members"
                append-inner-icon="mdi-magnify"
                v-model="searchKeyword"
                @update:modelValue="search"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-select
                style="width: 200px"
                dense
                variant="solo"
                clearable
                label="Status"
                :items="statuses"
                item-title="name"
                item-value="id"
                v-model="searchStatus"
                @update:modelValue="search"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn
            class="text-none"
            prepend-icon="mdi-plus"
            width="160"
            height="56"
            color="#2B343F"
            @click="openModalMemberAdd"
          >
            Add Member
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table :headers="headers" :items="members" :items-per-page="25">
        <template v-slot:[`item.dob`]="{ item }">
          {{ formatDateString(item.dob) }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          {{ item.status === 1 ? 'Active' : 'Deactivated' }}
        </template>
      </v-data-table>
    </v-sheet>

    <ModalMemberAdd
      v-model="isModalMemberAddVisible"
      @closeModal="closeModalMemberAdd"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';

const headers = ref([
  { title: 'Created On', value: 'created_at', width: 120 },
  { title: 'Login', value: 'username', width: 140 },
  { title: 'Full Name', value: 'name', width: 140 },
  { title: 'D.O.B', value: 'dob', width: 120 },
  { title: 'Phone', value: 'phone', width: 140 },
  { title: 'Address', value: 'address', width: 'auto' },
  { title: 'Hourly Rate', value: 'hourly_rate', width: 120 },
  { title: 'Status', value: 'status', width: 120 },
]);

const searchKeyword = ref('');
const searchStatus = ref(1);

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

const isModalMemberAddVisible = ref(false);

const openModalMemberAdd = () => {
  isModalMemberAddVisible.value = true;
};

const closeModalMemberAdd = () => {
  isModalMemberAddVisible.value = false;
};

const search = async () => {
  try {
    const response = await axios.get(
      `/users?keyword=${searchKeyword.value || ''}&status=${searchStatus.value ?? ''}`,
    );
    if (response?.data) {
      members.value = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped></style>
