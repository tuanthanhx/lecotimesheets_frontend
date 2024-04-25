<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Payroll Reports</h1>

    <v-select style="width: 300px;" dense variant="solo" clearable label="Select Member" v-model="selectedMember"
      :items="['John Smith', 'Nancy Anderson']"></v-select>

    <template v-if="!selectedMember">
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
      <h2 class="text-h6 mb-4">{{ selectedMember }}</h2>
      <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
        <v-data-table :headers="headers" :items="items" :items-per-page="25">
          <template v-slot:[`item.break`]="{ item }">
            <v-icon v-if="item.break" icon="mdi-check-circle" />
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn class="text-none" @click="openModalPayrollDetail(item)" color="#2B343F" height="32">Detail</v-btn>
          </template>
        </v-data-table>
      </v-sheet>
    </template>

    <ModalPayrollDetail v-model="isModalPayrollDetailVisible" @closeModal="closeModalPayrollDetail" />

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const selectedMember = ref(null);

const headers = ref([
  { title: 'Pay Date', value: 'date', width: 140 },
  { title: 'Paid Amount', value: 'amount', width: 'auto' },
  { title: '', value: 'actions', width: 140 },
]);

const items = ref([
  {
    id: 1,
    date: '05-03-2024',
    amount: 200,
  },
  {
    id: 2,
    date: '06-03-2024',
    amount: 300,
  },
  {
    id: 3,
    date: '07-03-2024',
    amount: 400,
  },
  {
    id: 4,
    date: '08-03-2024',
    amount: 500,
  },
  {
    id: 5,
    date: '09-03-2024',
    amount: 600,
  },
]);

const isModalPayrollDetailVisible = ref(false);

const openModalPayrollDetail = (item) => {
  console.log(item);
  isModalPayrollDetailVisible.value = true;
};

const closeModalPayrollDetail = () => {
  isModalPayrollDetailVisible.value = false;
};

</script>

<style lang="scss" scoped></style>
