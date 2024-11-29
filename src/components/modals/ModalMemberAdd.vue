<template>
  <v-dialog persistent v-model="isModalVisible" max-width="700px">
    <v-card class="pa-0 pb-4 pa-sm-4">
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <div class="text-h5">Add Member</div>
        <v-btn class="mr-n2" icon="mdi-close" variant="text" @click="closeModal"></v-btn>
      </v-card-title>
      <form @submit.prevent="submit" class="form-dialog">
        <v-card-text class="pa-4">
          <v-responsive max-width="100%">
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Full Name <span class="text-red">*</span></h3>
                <v-text-field variant="outlined" density="compact" v-model="name" v-bind="name_attrs" :error-messages="errors.name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Login <span class="text-red">*</span></h3>
                <v-text-field variant="outlined" density="compact" v-model="username" v-bind="username_attrs" :error-messages="errors.username"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Password <span class="text-red">*</span></h3>
                <v-text-field
                  variant="outlined"
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
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Confirm Password <span class="text-red">*</span></h3>
                <v-text-field
                  variant="outlined"
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
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">D.O.B</h3>
                <date-picker variant="outlined" density="compact" v-model="dob" v-bind="dob_attrs"></date-picker>
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Phone</h3>
                <v-text-field variant="outlined" density="compact" v-model="phone" v-bind="phone_attrs" :error-messages="errors.phone"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Address</h3>
                <v-text-field variant="outlined" density="compact" v-model="address" v-bind="address_attrs" :error-messages="errors.address"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Language</h3>
                <v-select
                  style="width: 200px"
                  variant="outlined"
                  density="compact"
                  v-model="language"
                  v-bind="language_attrs"
                  disabled
                  :items="languages"
                  item-title="name"
                  item-value="code"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Hourly Rate <span class="text-red">*</span></h3>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  prefix="$"
                  type="number"
                  step="0.01"
                  v-model="hourly_rate"
                  v-bind="hourly_rate_attrs"
                  :error-messages="errors.hourly_rate"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-2 mb-2">Status</h3>
                <v-select
                  style="width: 200px"
                  variant="outlined"
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
        <v-card-actions class="px-4 mt-4 justify-center">
          <v-btn class="text-none mr-4" variant="elevated" width="120" height="40" color="#2b343f" type="submit" :loading="isLoading" :disabled="!meta.valid"
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
const showPassword = ref(false);

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

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    username: yup.string().required().label('Login'),
    password: yup.string().min(6).required().label('Password'),
    password_confirm: yup
      .string()
      .min(6)
      .required()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .label('Confirm Password'),
    name: yup.string().required().label('Name'),
    dob: yup.string().optional().nullable().label('D.O.B'),
    phone: yup.string().optional().nullable().label('Phone'),
    address: yup.string().optional().nullable().label('Address'),
    hourly_rate: yup
      .number()
      .min(1)
      .required()
      .transform((value) => (isNaN(value) ? 0 : value))
      .label('Hourly Rate'),
    language: yup.string().optional().nullable().label('Language'),
    status: yup.number().optional().nullable().label('Status'),
  }),
  initialValues: {
    status: 1,
    language: 'en',
  },
});

const [username, username_attrs] = defineField('username');
const [password, password_attrs] = defineField('password');
const [password_confirm, password_confirm_attrs] = defineField('password_confirm');
const [name, name_attrs] = defineField('name');
const [dob, dob_attrs] = defineField('dob');
const [phone, phone_attrs] = defineField('phone');
const [address, address_attrs] = defineField('address');
const [hourly_rate, hourly_rate_attrs] = defineField('hourly_rate');
const [language, language_attrs] = defineField('language');
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
      username: values.username,
      password: values.password,
      name: values.name,
      dob: values.dob ? formatDateString(values.dob) : null,
      phone: values.phone,
      address: values.address,
      hourly_rate: values.hourly_rate,
      language: values.language,
      status: values.status,
    };
    const response = await axios.post('/users', object);
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
