<template>
  <v-dialog persistent v-model="isModalVisible" max-width="640px">
    <v-card class="pa-0 pb-4 pa-sm-4">
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <div class="text-h5">Job Details</div>
        <v-btn class="mr-n2" icon="mdi-close" variant="text" @click="closeModal"></v-btn>
      </v-card-title>
      <form @submit.prevent="submit" class="form-dialog">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Name</h3>
                {{ viewItem.name }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Detail</h3>
                {{ viewItem.detail }}
              </v-col>
            </v-row>
            <v-row v-if="userData?.group === 6">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Revenue</h3>
                {{ formatCurrencyString(viewItem.revenue) }}
              </v-col>
            </v-row>
            <v-row v-if="userData?.group === 6">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Material Cost</h3>
                {{ formatCurrencyString(viewItem.material_cost) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Status</h3>
                <template v-if="viewItem.status === 1">
                  <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-folder-open">Open</v-chip>
                </template>
                <template v-else>
                  <v-chip min-width="100" size="small" color="#606060" variant="flat" prepend-icon="mdi-folder-lock">Closed</v-chip>
                </template>
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2b343f" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { formatCurrencyString } from '@/plugins/utils';

const userStore = useUserStore();
const userData = userStore.userData;

const emit = defineEmits(['close']);

const props = defineProps({
  item: Object,
});

const viewItem = ref({});
viewItem.value = { ...props.item };

const isModalVisible = ref(false);

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
