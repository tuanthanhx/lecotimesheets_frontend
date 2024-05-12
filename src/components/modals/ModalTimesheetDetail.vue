<template>
  <v-dialog persistent v-model="isModalVisible" max-width="1000px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">{{ viewItem.job.name }}</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row v-if="props.role === 'admin'">
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Member</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.user.name" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Job</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.job.name" readonly></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Date</h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  :value="viewItem.date ? formatDateString(viewItem.date) : ''"
                  append-inner-icon="mdi-calendar"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Time Range</h3>
                <div class="d-flex justify-center">
                  <v-text-field style="width: 120px" variant="solo-filled" density="compact" :value="viewItem.start_time" readonly></v-text-field>
                  <div class="mx-2">-</div>
                  <v-text-field style="width: 120px" variant="solo-filled" density="compact" :value="viewItem.end_time" readonly></v-text-field>
                </div>
              </v-col>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Break</h3>
                <v-checkbox v-model="hasBreak" readonly></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="props.role === 'admin'">
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

            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Note</h3>
                <v-textarea variant="solo-filled" density="compact" v-model="viewItem.note" placeholder="What were you working on?" readonly></v-textarea>
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
import { formatDateString } from '@/plugins/utils';

const emit = defineEmits(['close']);

const props = defineProps({
  item: Object,
  role: String,
});

const viewItem = ref({});
viewItem.value = { ...props.item };

const isModalVisible = ref(false);

const statuses = ref([
  {
    id: 1,
    name: 'Pending',
  },
  {
    id: 2,
    name: 'Approved',
  },
]);

const hasBreak = ref(false);

watch(
  () => props.item,
  (newValue) => {
    viewItem.value = { ...newValue };
    hasBreak.value = viewItem.value?.break ? true : false;
  },
);

const closeModal = () => {
  emit('close');
};
</script>
