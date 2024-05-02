<template>
  <v-dialog persistent v-model="isModalVisible" max-width="1000px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">{{ viewItem.name }}</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Full Name</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.name" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Login</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.username" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">D.O.B</h3>
                <v-text-field variant="solo-filled" density="compact" :value="viewItem.dob ? formatDateString(viewItem.dob) : ''" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Phone</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.phone" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Address</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="viewItem.address" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Language</h3>
                <v-select
                  style="width: 200px"
                  variant="solo-filled"
                  density="compact"
                  v-model="viewItem.language"
                  :items="languages"
                  item-title="name"
                  item-value="code"
                  readonly
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Hourly Rate</h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="viewItem.hourly_rate"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
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
import { ref, watch, defineProps } from 'vue';
import { formatDateString } from '@/plugins/utils';

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
    name: 'Active',
  },
  {
    id: 2,
    name: 'Deactivated',
  },
]);

const languages = ref([
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
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
