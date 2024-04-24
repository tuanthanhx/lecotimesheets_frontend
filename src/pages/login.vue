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
                <v-text-field label="Username" variant="outlined" v-model="data.username"></v-text-field>
                <v-text-field label="Password" variant="outlined" v-model="data.password" type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-btn variant="tonal" block height="48" @click="submitLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  username: '',
  password: ''
});

const submitLogin = () => {
  console.log('Login data submitted:', data.value);
}

</script>
