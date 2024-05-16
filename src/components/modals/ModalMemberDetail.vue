<template>
  <v-dialog persistent v-model="isModalVisible" max-width="700px">
    <v-card class="pa-0 pb-4 pa-sm-4">
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <div class="text-h5">Member Details</div>
        <v-btn class="mr-n2" icon="mdi-close" variant="text" @click="closeModal"></v-btn>
      </v-card-title>
      <form @submit.prevent="submit" class="form-dialog">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Full Name</h3>
                {{ viewItem.name }}
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Login</h3>
                {{ viewItem.username }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">D.O.B</h3>
                <template v-if="viewItem.dob">{{ formatDateString(viewItem.dob) }}</template>
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Phone</h3>
                {{ viewItem.phone }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Address</h3>
                {{ viewItem.address }}
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Language</h3>
                <template v-if="viewItem.language === 'en'">English</template>
                <template v-else>Vietnamese</template>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Hourly Rate</h3>
                {{ formatCurrencyString(viewItem.hourly_rate) }}
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Status</h3>
                <template v-if="viewItem.status === 1">
                  <v-chip min-width="100" size="small" color="#4caf50" variant="flat" prepend-icon="mdi-account-check">Active</v-chip>
                </template>
                <template v-else>
                  <v-chip min-width="100" size="small" color="#606060" variant="flat" prepend-icon="mdi-account-off">Deactivated</v-chip>
                </template>
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="px-4 mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2b343f" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatDateString, formatCurrencyString } from '@/plugins/utils';

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
