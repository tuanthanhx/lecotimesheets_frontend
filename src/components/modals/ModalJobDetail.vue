<template>
  <v-dialog persistent v-model="isModalVisible" max-width="640px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">{{ viewItem.name }}</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Name <span class="text-red">*</span></h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.name" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Detail</h3>
                <v-textarea variant="solo-filled" density="compact" v-model="viewItem.detail" readonly></v-textarea>
              </v-col>
            </v-row>
            <v-row v-if="userData?.isAdmin">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Revenue</h3>
                <v-text-field variant="solo-filled" density="compact" prefix="$" type="number" step="0.01" v-model="viewItem.revenue" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="userData?.isAdmin">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Material Cost</h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="viewItem.material_cost"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Status</h3>
                <v-select
                  style="width: 200px"
                  variant="solo-filled"
                  density="compact"
                  v-model="viewItem.status"
                  :items="statuses"
                  item-title="name"
                  item-value="id"
                  readonly
                ></v-select>
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2B343F" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const userData = userStore.userData;

const emit = defineEmits(['close']);

const props = defineProps({
  item: Object,
});

const viewItem = ref({});
viewItem.value = { ...props.item };

const isModalVisible = ref(false);

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

watch(
  () => props.item,
  (newValue) => {
    viewItem.value = { ...newValue };
  },
);

const closeModal = () => {
  emit('close');
};
</script>
