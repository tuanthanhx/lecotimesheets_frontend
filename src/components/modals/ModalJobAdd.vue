<template>
  <v-dialog persistent v-model="isModalVisible" max-width="640px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">Add Job</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Name <span class="text-red">*</span></h3>
                <v-text-field variant="solo-filled" density="compact" v-model="name" v-bind="name_attrs" :error-messages="errors.name"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Detail</h3>
                <v-textarea variant="solo-filled" density="compact" v-model="detail" v-bind="detail_attrs" :error-messages="errors.detail"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Revenue</h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="revenue"
                  v-bind="revenue_attrs"
                  :error-messages="errors.revenue"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Material Cost</h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="material_cost"
                  v-bind="material_cost_attrs"
                  :error-messages="errors.material_cost"
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
                  v-model="status"
                  v-bind="status_attrs"
                  :items="statuses"
                  item-title="name"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2B343F" type="submit" :loading="isLoading" :disabled="!meta.valid"
            >Save</v-btn
          >
          <v-btn class="text-none" variant="elevated" width="120" height="40" @click="closeModal">Cancel</v-btn>
        </v-card-actions>
      </form>
    </v-card>
    <MessageDialog v-model="isMessageDialogVisible" :title="messageTitle" :message="messageText" :type="messageType" />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showError } = useMessageDialog();

const emit = defineEmits(['close', 'submit']);

const isModalVisible = ref(false);
const isLoading = ref(false);

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

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required().label('Name'),
    detail: yup.string().optional().label('Detail'),
    revenue: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .optional()
      .label('Revenue'),
    material_cost: yup
      .number()
      .optional()
      .transform((value) => (isNaN(value) ? 0 : value))
      .label('Material Cost'),
    status: yup.number().optional().label('Status'),
  }),
  initialValues: {
    status: 1,
  },
});

const [name, name_attrs] = defineField('name');
const [detail, detail_attrs] = defineField('detail');
const [revenue, revenue_attrs] = defineField('revenue');
const [material_cost, material_cost_attrs] = defineField('material_cost');
const [status, status_attrs] = defineField('status');

const closeModal = () => {
  emit('close');
  setTimeout(() => {
    resetForm();
  }, 500);
};

const submit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const object = {
      name: values.name,
      detail: values.detail,
      revenue: values.revenue,
      material_cost: values.material_cost,
      status: values.status,
    };
    const response = await axios.post('/jobs', object);
    if (response?.data) {
      emit('submit');
      setTimeout(() => {
        resetForm();
      }, 500);
    }
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.message) {
      showError(error.response.data.message, null);
    } else if (error?.message) {
      showError(error.message, null);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>
