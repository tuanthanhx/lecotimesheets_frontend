<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Settings</h1>
    <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg" elevation="2">
      <v-responsive max-width="900">
        <form @submit.prevent="submit">
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Full Name <span class="text-red">*</span></h3>
              <v-text-field variant="solo-filled" v-model="name" v-bind="name_attrs" :error-messages="errors.name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Login <span class="text-red">*</span></h3>
              <v-text-field variant="solo-filled" readonly disabled v-model="username" v-bind="username_attrs" :error-messages="errors.username"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">New Password</h3>
              <v-text-field
                variant="solo-filled"
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
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Confirm Password <span v-if="password" class="text-red">*</span></h3>
              <v-text-field
                variant="solo-filled"
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
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">D.O.B</h3>
              <date-picker variant="solo-filled" v-model="dob" v-bind="dob_attrs"></date-picker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Phone</h3>
              <v-text-field variant="solo-filled" v-model="phone" v-bind="phone_attrs" :error-messages="errors.phone"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Address</h3>
              <v-text-field variant="solo-filled" density="compact" v-model="address" v-bind="address_attrs" :error-messages="errors.address"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Language</h3>
              <v-select
                style="width: 200px"
                variant="solo-filled"
                v-model="language"
                v-bind="language_attrs"
                :items="languages"
                item-title="name"
                item-value="code"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <v-btn class="text-none" width="160" height="56" color="#2B343F" type="submit" :loading="isLoading" :disabled="!meta.valid"> Save </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn class="text-none" width="160" height="56" @click.prevent="reset"> Cancel </v-btn>
            </v-col>
          </v-row>
        </form>
        <v-alert class="mt-8" type="info" v-if="formAlert" transition="scale-transition"> {{ formAlert }}</v-alert>
      </v-responsive>
    </v-sheet>
  </v-container>
  <MessageDialog v-model="isMessageDialogVisible" :title="messageTitle" :message="messageText" :type="messageType" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axios from '@/plugins/axios';
import { formatDateString } from '@/plugins/utils';
import { useMessageDialog } from '@/plugins/message_dialogs';

const { isMessageDialogVisible, messageTitle, messageText, messageType, showError } = useMessageDialog();

const user = ref({});
const isLoading = ref(false);
const showPassword = ref(false);
const formAlert = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('/settings');
    if (response?.data) {
      user.value = response.data;
    }
  } catch (error) {
    console.error('Logout failed', error);
  }
});

const { meta, errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object().shape({
    username: yup.string().required().label('Login'),
    password: yup.string().when({
      is: (val) => !!val,
      then: () => yup.string().min(6).required(),
      otherwise: () => yup.string().notRequired(),
    }),
    password_confirm: yup.string().when('password', {
      is: (val) => !!val,
      then: () =>
        yup
          .string()
          .min(6)
          .required()
          .oneOf([yup.ref('password'), null], 'Passwords must match'),
      otherwise: () => yup.string().notRequired(),
    }),
    name: yup.string().required().label('Name'),
    dob: yup.string().optional().nullable().label('D.O.B'),
    phone: yup.string().optional().nullable().label('Phone'),
    address: yup.string().optional().nullable().label('Address'),
    language: yup.string().optional().nullable().label('Language'),
  }),
  initialValues: {
    name: user.value.name,
    dob: user.value.dob ? new Date(user.value.dob) : null,
    phone: user.value.phone,
    address: user.value.address,
    username: user.value.username,
    password: '',
    password_confirm: '',
    language: user.value.language,
  },
});

watch(
  () => user.value,
  (newValue) => {
    resetForm({
      values: {
        username: newValue.username,
        password: '',
        password_confirm: '',
        name: newValue.name,
        dob: newValue.dob ? new Date(newValue.dob) : null,
        phone: newValue.phone,
        address: newValue.address,
        language: newValue.language,
      },
    });
  },
);

const [username, username_attrs] = defineField('username');
const [password, password_attrs] = defineField('password');
const [password_confirm, password_confirm_attrs] = defineField('password_confirm');
const [name, name_attrs] = defineField('name');
const [dob, dob_attrs] = defineField('dob');
const [phone, phone_attrs] = defineField('phone');
const [address, address_attrs] = defineField('address');
const [language, language_attrs] = defineField('language');

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

const submit = handleSubmit(async (values) => {
  isLoading.value = true;
  formAlert.value = '';
  try {
    const object = {
      username: values.username,
      name: values.name,
      dob: values.dob ? formatDateString(values.dob) : null,
      phone: values.phone,
      address: values.address,
      language: values.language,
    };
    if (values.password) {
      object.password = values.password;
    }
    const response = await axios.post('/settings', object);
    if (response?.data) {
      formAlert.value = 'Settings updated successfully!';
      console.log(response.data);
      console.log(user.value);
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

const reset = async () => {
  try {
    const response = await axios.get('/settings');
    if (response?.data) {
      user.value = response.data;
      resetForm({
        values: {
          username: user.value.username,
          password: '',
          password_confirm: '',
          name: user.value.name,
          dob: user.value.dob ? formatDateString(user.value.dob) : null,
          phone: user.value.phone,
          address: user.value.address,
          language: user.value.language,
        },
        errors: null,
        touched: false,
        dirty: false,
      });
      formAlert.value = '';
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.v-responsive {
  overflow: visible;
}
</style>
