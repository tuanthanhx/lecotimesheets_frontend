<template>
  <v-container fluid class="fill-height">
    <v-responsive class="mx-auto pa-4" max-width="600">
      <v-row justify="center" class="mb-4">
        <v-col cols="12">
          <v-img class="mx-auto" width="440" height="132" src="@/assets/img/logo.png" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <v-card class="pa-8" elevation="4">
            <v-card-title class="text-h5 pa-0 mb-6" align="center">Sign in to continue</v-card-title>
            <v-card-text class="pa-0">
              <v-form>
                <v-text-field prepend-inner-icon="mdi-account" variant="outlined"
                  v-model="username"></v-text-field>
                <v-text-field prepend-inner-icon="mdi-lock" variant="outlined" v-model="password"
                  type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-btn class="text-none" variant="elevated" block width="160" height="56" color="#2B343F"
                @click="submitLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../plugins/axios';
import { useRouter } from 'vue-router';
const router = useRouter();

const username = ref('incrxi@gmail.com'); // TODO: Test
const password = ref('12345678'); // TODO: Test

const submitLogin = async () => {
  try {
    const response = await axios.post('/auth/login', {
      email: username.value,
      password: password.value,
    });
    if (response?.data) {
      localStorage.setItem('access_token', response.data.access_token);
      router.push('/admin/timesheets');
    }
  } catch (error) {
    console.error('An error occurred');
    console.error(error);
  }
}

</script>
