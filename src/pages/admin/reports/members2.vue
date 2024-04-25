<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Member Reports</h1>

    <v-row>
      <v-col cols="auto">
        <v-select style="width: 300px;" dense variant="solo" clearable label="Select Member" v-model="selectedMember"
          :items="['John Smith', 'Nancy Anderson']"></v-select>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <!-- <v-btn class="text-none" prepend-icon="mdi-currency-usd" width="160" height="56" color="#2B343F">
          Pay now
        </v-btn> -->
      </v-col>
    </v-row>

    <h2 class="text-h6 mb-4">{{ selectedMember }}</h2>

    <v-sheet class="pa-4" color="#ffffff" border="sm" rounded="lg">
      <v-data-table :headers="headers" :items="items" :items-per-page="-1">
        <template v-slot:[`item.break`]="{ item }">
          <v-icon v-if="item.break" icon="mdi-check-circle" />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="text-none" @click="openDialog(item)" color="#2B343F" height="32">Detail</v-btn>
        </template>
        <template #bottom></template>
      </v-data-table>
    </v-sheet>

    <!-- <ModalPayrollDetail v-if="selectedDessert" :selectedDessert="selectedDessert" /> -->
    <!-- <ModalPayrollDetail v-if="isDialogVisible" :title="'Hello'" :message="'This is a dialog!'" @close="closeDialog" /> -->
    <ModalPayrollDetail v-model="isDialogVisible" :selectedDessert="selectedDessert" @closeDialog="closeDialog" />

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
// import ModalPayrollDetail from '@/components/ModalPayrollDetail.vue';
const selectedMember = ref('John Smith');
const headers = ref([
  { title: 'Pay Date', value: 'date', width: 140, summable: false },
  { title: 'Paid Amount', value: 'amount', width: 'auto', summable: false },
  { title: '', value: 'actions', width: 140, summable: true },
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
    amount: 200,
  },
  {
    id: 3,
    date: '07-03-2024',
    amount: 200,
  },
]);

// const showDetailModal = (item) => {
//   console.log(item);
// }

const selectedDessert = ref(null);


// const openDialog = (item) => {
//   console.log(item);
//   // selectedDessert.value = item;
//   modalPayrollDetail.value.openDialog(item);
// };

// const modalPayrollDetail = ref(null);


const isDialogVisible = ref(false);

const openDialog = (item) => {
  selectedDessert.value = item;
  isDialogVisible.value = true;
  console.log(item);
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

</script>

<style lang="scss" scoped></style>
