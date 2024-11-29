<template>
  <v-container fluid class="fill-height">
    <v-responsive class="mx-auto pa-2" max-width="600">
      <v-row justify="center" class="mb-sm-4">
        <v-col cols="8" sm="12">
          <v-img class="mx-auto" max-width="440" height="auto" aspect-ratio="440/132" src="@/assets/img/logo.png" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <v-card class="pa-6 pa-sm-8" elevation="4">
            <form @submit.prevent="submit">
              <v-card-title class="text-h5 pa-0 mb-4 mb-sm-6" align="center">Sign in to continue</v-card-title>
              <v-card-text class="pa-0">
                <v-text-field
                  class="mb-2"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :density="$vuetify?.display?.xs ? 'compact' : 'default'"
                  v-model="username"
                  v-bind="username_attrs"
                  :error-messages="errors.username"
                ></v-text-field>
                <v-text-field
                  class="mb-2"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  :density="$vuetify?.display?.xs ? 'compact' : 'default'"
                  v-model="password"
                  v-bind="password_attrs"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  hint="At least 6 characters"
                  :error-messages="errors.password"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="pa-0">
                <v-btn
                  type="submit"
                  class="text-none"
                  variant="elevated"
                  block
                  :height="$vuetify?.display?.xs ? '40' : '56'"
                  color="#2b343f"
                  :loading="isLoading"
                  :disabled="!meta.valid"
                  >Login</v-btn
                >
              </v-card-actions>
              <v-alert class="mt-8" type="error" v-if="formAlert" transition="scale-transition"> {{ formAlert }}</v-alert>
            </form>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import axios from '@/plugins/axios';

const router = useRouter();
const userStore = useUserStore();
const showPassword = ref(false);
const isLoading = ref(false);
const formAlert = ref('');

const { meta, errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object().shape({
    username: yup.string().required().label('Username'),
    password: yup.string().min(6).required().label('Password'),
  }),
});

const [username, username_attrs] = defineField('username');
const [password, password_attrs] = defineField('password');

const submit = handleSubmit(async (values) => {
  isLoading.value = true;
  formAlert.value = '';
  try {
    const response = await axios.post('/auth/login', {
      username: values.username,
      password: values.password,
    });
    if (response?.data) {
      localStorage.setItem('access_token', response.data.access_token);
      userStore.setUser({
        username: response.data.username,
        group: response.data.group,
      });
      if (response.data.group === 6) {
        router.push('/admin/timesheets');
      } else {
        router.push({
          path: '/member/timesheets',
          query: { ref: 'login' },
        });
      }
    }
  } catch (error) {
    isLoading.value = false;
    if (error?.response?.data?.error === 'Deactivated') {
      formAlert.value = 'Your account is deactivated.';
    } else {
      formAlert.value = 'Invalid username or password.';
    }
    console.error(error);
  }
});
</script>
