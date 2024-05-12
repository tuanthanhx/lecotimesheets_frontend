<template>
  <v-dialog persistent v-model="isModalVisible" max-width="1000px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">Add Timesheet</span>
      </v-card-title>
      <form @submit.prevent="submit">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row v-if="props.role === 'admin'">
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
            <v-row v-if="props.role === 'admin'">
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
import { useMessageDialog } from '@/plugins/message_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showError } = useMessageDialog();

const emit = defineEmits(['close', 'submit']);

const props = defineProps({
  users: Object,
  jobs: Object,
  role: String,
});

const isModalVisible = ref(false);
const isLoading = ref(false);

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

const startTimeItems = ref([]);
const endTimeItems = ref([]);

for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, '0');
  startTimeItems.value.push(`${hour}:00`, `${hour}:30`);
  endTimeItems.value.push(`${hour}:00`, `${hour}:30`);
}

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    job: yup.number().required().label('Job'),
    date: yup.string().required().label('Date'),
    start_time: yup.string().required().label('Start Time'),
    end_time: yup.string().required().label('End Time'),
    note: yup.string().optional().label('note'),
    has_break: yup.boolean().optional().label('Break'),
    user: yup.number().when('$role', (role, schema) => (role === 'admin' ? schema.required().label('Member') : schema.label('Member'))),
    status: yup.number().when('$role', (role, schema) => (role === 'admin' ? schema.required().label('Status') : schema.label('Status'))),
  }),
  initialValues: {
    status: props.role === 'admin' ? 1 : undefined,
    has_break: true,
    date: new Date(),
  },
  context: { role: props.role },
});

const [job, job_attrs] = defineField('job');
const [date, date_attrs] = defineField('date');
const [start_time, start_time_attrs] = defineField('start_time');
const [end_time, end_time_attrs] = defineField('end_time');
const [has_break, has_break_attrs] = defineField('has_break');
const [note, note_attrs] = defineField('note');
const [user, user_attrs] = defineField('user');
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
      job_id: values.job,
      date: values.date,
      start_time: values.start_time,
      end_time: values.end_time,
      break: values.has_break,
      note: values.note,
    };
    if (props.role === 'admin') {
      object.user_id = values.user;
      object.status = values.status;
    }
    const response = await axios.post('/timesheets', object);
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
