<template>
  <v-dialog persistent v-model="isModalVisible" max-width="1000px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">Add Timesheet</span>
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
                  <v-select variant="solo-filled" style="width: 120px" density="compact" v-model="startTime" :items="startTimeItems" placeholder="Start time"></v-select>
                  <div class="mx-2">-</div>
                  <v-select variant="solo-filled" style="width: 120px" density="compact" v-model="endTime" :items="endTimeItems" placeholder="End time"></v-select>
                </div>
              </v-col>
              <v-col cols="4">
                <h3 class="text-subtitle-2 mb-2">Break</h3>
                <v-checkbox v-model="breakTime"></v-checkbox>
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
            <!--
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Full Name <span class="text-red">*</span></h3>
                <v-text-field variant="solo-filled" density="compact" v-model="name" v-bind="name_attrs" :error-messages="errors.name"></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Login <span class="text-red">*</span></h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  v-model="username"
                  v-bind="username_attrs"
                  :error-messages="errors.username"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Password <span class="text-red">*</span></h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  autocomplete="new-password"
                  v-model="password"
                  v-bind="password_attrs"
                  :error-messages="errors.password"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  hint="At least 6 characters"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Confirm Password <span class="text-red">*</span></h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  autocomplete="new-password"
                  v-model="password_confirm"
                  v-bind="password_confirm_attrs"
                  :error-messages="errors.password_confirm"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  hint="At least 6 characters"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">D.O.B</h3>
                <date-picker variant="solo-filled" density="compact" v-model="dob" v-bind="dob_attrs"></date-picker>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Phone</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="phone" v-bind="phone_attrs" :error-messages="errors.phone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Address</h3>
                <v-text-field variant="solo-filled" density="compact" v-model="address" v-bind="address_attrs" :error-messages="errors.address"></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Language</h3>
                <v-select
                  style="width: 200px"
                  variant="solo-filled"
                  density="compact"
                  v-model="language"
                  v-bind="language_attrs"
                  :items="languages"
                  item-title="name"
                  item-value="code"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <h3 class="text-subtitle-2 mb-2">Hourly Rate <span class="text-red">*</span></h3>
                <v-text-field
                  variant="solo-filled"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="hourly_rate"
                  v-bind="hourly_rate_attrs"
                  :error-messages="errors.hourly_rate"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
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
            -->
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
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showError } = useMessageDialog();

const emit = defineEmits(['close', 'submit']);

const props = defineProps({
  users: Object,
  jobs: Object,
});

const isModalVisible = ref(false);
const isLoading = ref(false);

// const users = ref([]); TODO : DELETE
// const jobs = ref([]); TODO : DELETE

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

// TODO : DELETE WATCHES MAYBE
// watch(
//   () => props.users,
//   (newValue) => {
//     console.log(newValue);
//     users.value = { ...newValue };
//   },
// );

// watch(
//   () => props.jobs,
//   (newValue) => {
//     console.log(newValue);
//     jobs.value = { ...newValue };
//   },
// );

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    user: yup.number().required().label('Member'),
    job: yup.number().required().label('Job'),

    date: yup.string().required().label('Date'),

    startTime: yup.string().required().label('Start Time'),
    endTime: yup.string().required().label('End Time'),

    note: yup.string().optional().label('note'),

    // username: yup.string().required().label('Login'),
    // password: yup.string().min(6).required().label('Password'),
    // password_confirm: yup
    //   .string()
    //   .min(6)
    //   .required()
    //   .oneOf([yup.ref('password'), null], 'Passwords must match')
    //   .label('Confirm Password'),
    // name: yup.string().optional().label('Name'),
    // dob: yup.string().optional().label('D.O.B'),
    // phone: yup.string().optional().label('Phone'),
    // address: yup.string().optional().label('Address'),
    // hourly_rate: yup
    //   .number()
    //   .min(1)
    //   .required()
    //   .transform((value) => (isNaN(value) ? 0 : value))
    //   .label('Hourly Rate'),
    // language: yup.string().optional().label('Language'),
    // status: yup.number().optional().label('Status'),

    breakTime: yup.boolean().optional().label('Break'),
    status: yup.number().optional().label('Status'),
  }),
  initialValues: {
    status: 1,
    language: 'en',
    date: new Date(),
  },
});

const [user, user_attrs] = defineField('user');
const [job, job_attrs] = defineField('job');

const [date, date_attrs] = defineField('date');
// const [username, username_attrs] = defineField('username');
// const [password, password_attrs] = defineField('password');
// const [password_confirm, password_confirm_attrs] = defineField('password_confirm');
// const [name, name_attrs] = defineField('name');
// const [dob, dob_attrs] = defineField('dob');
// const [phone, phone_attrs] = defineField('phone');
// const [address, address_attrs] = defineField('address');
// const [hourly_rate, hourly_rate_attrs] = defineField('hourly_rate');
// const [language, language_attrs] = defineField('language');
// const [status, status_attrs] = defineField('status');
const [startTime, startTime_attrs] = defineField('startTime');
const [endTime, endTime_attrs] = defineField('endTime');
const [breakTime, breakTime_attrs] = defineField('breakTime');
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
      // password: values.password,
      // name: values.name,
      // dob: values.dob ? formatDateString(values.dob) : null,
      // phone: values.phone,
      // address: values.address,
      // hourly_rate: values.hourly_rate,
      startTime: values.startTime,
      endTime: values.endTime,
      breakTime: values.breakTime,
      status: values.status,
      note: values.note,
    };
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
