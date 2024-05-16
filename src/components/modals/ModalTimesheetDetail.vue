<template>
  <v-dialog persistent v-model="isModalVisible" max-width="700px">
    <v-card class="pa-0 pb-4 pa-sm-4">
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <div class="text-h5">Timesheet Details</div>
        <v-btn class="mr-n2" icon="mdi-close" variant="text" @click="closeModal"></v-btn>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row v-if="props.role === 'admin'">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Member</h3>
                {{ viewItem.user?.name }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Job</h3>
                {{ viewItem.job?.name }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="auto">
                <h3 class="text-subtitle-2 mb-2">Date</h3>
                {{ viewItem.date ? formatDateString(viewItem.date) : '' }}
              </v-col>
              <v-col cols="12" sm="auto" class="ml-sm-16">
                <h3 class="text-subtitle-2 mb-2">Time Range</h3>
                {{ viewItem.start_time }} - {{ viewItem.end_time }}
              </v-col>
              <v-col cols="12" sm="auto" class="ml-sm-16">
                <h3 class="text-subtitle-2 mb-2">Break</h3>
                <v-icon v-if="viewItem.break" icon="mdi-check-circle" />
                <v-icon v-else icon="mdi-checkbox-blank-circle-outline" />
              </v-col>
              <v-col cols="12" sm="auto" class="ml-sm-16">
                <h3 class="text-subtitle-2 mb-2">Duration</h3>
                {{ totalHours(viewItem.start_time, viewItem.end_time, viewItem.break)?.text }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Status</h3>
                <template v-if="viewItem.status === 1">
                  <v-chip min-width="100" size="small" color="#1e88c9" variant="flat" prepend-icon="mdi-sync">In review</v-chip>
                </template>
                <template v-else-if="viewItem.status === 2">
                  <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-checkbox-marked-circle">Approved</v-chip>
                </template>
                <template v-else-if="viewItem.status === 3">
                  <v-chip min-width="100" size="small" color="#e91e63" variant="flat" prepend-icon="mdi-currency-usd">Paid</v-chip>
                </template>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Note</h3>
                {{ viewItem.note }}
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="px-4 mt-4 justify-sm-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2b343f" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatDateString, totalHours } from '@/plugins/utils';

const emit = defineEmits(['close']);

const props = defineProps({
  item: Object,
  role: String,
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
