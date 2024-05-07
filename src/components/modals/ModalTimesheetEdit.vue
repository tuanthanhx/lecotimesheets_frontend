<template>
  <v-dialog persistent v-model="isModalVisible" max-width="1000px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">Edit Timesheet</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Member</h3>
                <v-select
                  variant="solo-filled"
                  density="compact"
                  v-model="user"
                  v-bind="user_attrs"
                  :items="props.users"
                  item-title="name"
                  item-value="id"
                  placeholder="Select member"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Job</h3>
                <v-select
                  variant="solo-filled"
                  density="compact"
                  v-model="job"
                  v-bind="job_attrs"
                  :items="props.jobs"
                  item-title="name"
                  item-value="id"
                  placeholder="Select job"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Date</h3>
                <date-picker variant="solo-filled" density="compact" v-model="date" v-bind="date_attrs" placeholder="Select date"></date-picker>
              </v-col>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Time Range</h3>
                <div class="d-flex justify-center">
                  <v-select
                    variant="solo-filled"
                    style="width: 120px"
                    density="compact"
                    v-model="start_time"
                    v-bind="start_time_attrs"
                    :items="startTimeItems"
                    placeholder="Start time"
                  ></v-select>
                  <div class="mx-2">-</div>
                  <v-select
                    variant="solo-filled"
                    style="width: 120px"
                    density="compact"
                    v-model="end_time"
                    v-bind="end_time_attrs"
                    :items="endTimeItems"
                    placeholder="End time"
                  ></v-select>
                </div>
              </v-col>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Break</h3>
                <v-checkbox v-model="has_break" v-bind="has_break_attrs"></v-checkbox>
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
            <v-row>
              <v-col cols="12">
                <h3 class="text-subtitle-2 mb-2">Note</h3>
                <v-textarea
                  variant="solo-filled"
                  density="compact"
                  v-model="note"
                  v-bind="note_attrs"
                  :error-messages="errors.note"
                  placeholder="What were you working on?"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2B343F" type="submit" :loading="isLoading" :disabled="!meta.valid"
            >Update</v-btn
          >
          <v-btn class="text-none" variant="elevated" width="120" height="40" @click="closeModal">Cancel</v-btn>
        </v-card-actions>
      </form>
    </v-card>
    <MessageDialog v-model="isMessageDialogVisible" :title="messageTitle" :message="messageText" :type="messageType" />
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showError } = useMessageDialog();

const emit = defineEmits(['close', 'submit']);

const props = defineProps({
  item: Object,
  users: Object,
  jobs: Object,
});

const editItem = ref({});
editItem.value = { ...props.item };

const isModalVisible = ref(false);
const isLoading = ref(false);

const statuses = ref([
  {
    id: 1,
    name: 'Confirming',
  },
  {
    id: 2,
    name: 'Approved',
  },
]);

const startTimeItems = ref([]);
const endTimeItems = ref([]);

for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, '0');
  startTimeItems.value.push(`${hour}:00`, `${hour}:30`);
  endTimeItems.value.push(`${hour}:00`, `${hour}:30`);
}

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    user: yup.number().required().label('Member'),
    job: yup.number().required().label('Job'),
    date: yup.string().required().label('Date'),
    start_time: yup.string().required().label('Start Time'),
    end_time: yup.string().required().label('End Time'),
    note: yup.string().optional().label('note'),
    has_break: yup.bool().optional().label('Break'),
    status: yup.number().optional().label('Status'),
  }),
  initialValues: {
    user: editItem.value.user_id,
    job: editItem.value.job_id,
    date: editItem.value.date ? new Date(editItem.value.date) : null,
    start_time: editItem.value.start_time,
    end_time: editItem.value.end_time,
    note: editItem.value.note,
    has_break: editItem.value.break ? true : false,
    status: editItem.value.status,
  },
});

watch(
  () => props.item,
  (newValue) => {
    editItem.value = { ...newValue };
    resetForm({
      values: {
        user: newValue.user_id,
        job: newValue.job_id,
        date: newValue.date ? new Date(newValue.date) : null,
        start_time: newValue.start_time,
        end_time: newValue.end_time,
        note: newValue.note,
        has_break: newValue.break ? true : false,
        status: newValue.status,
      },
    });
  },
);

const [user, user_attrs] = defineField('user');
const [job, job_attrs] = defineField('job');
const [date, date_attrs] = defineField('date');
const [start_time, start_time_attrs] = defineField('start_time');
const [end_time, end_time_attrs] = defineField('end_time');
const [has_break, has_break_attrs] = defineField('has_break');
const [note, note_attrs] = defineField('note');
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
      user_id: values.user,
      job_id: values.job,
      date: values.date ? formatDateString(values.date) : null,
      start_time: values.start_time,
      end_time: values.end_time,
      break: values.has_break,
      status: values.status,
      note: values.note,
    };
    if (values.password) {
      object.password = values.password;
    }
    const response = await axios.put(`/timesheets/${editItem.value.id}`, object);
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
