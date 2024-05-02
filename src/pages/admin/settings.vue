<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Settings</h1>
    <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg">
      <v-responsive max-width="900">
        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-2 mb-2">Username</h3>
            <v-text-field variant="solo-filled" v-model="username"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-2 mb-2">Full Name</h3>
            <v-text-field variant="solo-filled"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-2 mb-2">New Password</h3>
            <v-text-field
              variant="solo-filled"
              v-model="password1"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              hint="At least 8 characters"
              name="input-10-1"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-2 mb-2">Confirm Password</h3>
            <v-text-field
              variant="solo-filled"
              v-model="password2"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show2 ? 'text' : 'password'"
              hint="At least 8 characters"
              name="input-10-1"
              counter
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="text-subtitle-2 mb-2">Language</h3>
            <v-select style="width: 200px" variant="solo-filled" value="Default" :items="['Default', 'English', 'Tiếng Việt']"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-btn class="text-none" width="160" height="56" color="#2B343F"> Save </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn class="text-none" width="160" height="56"> Cancel </v-btn>
          </v-col>
        </v-row>
      </v-responsive>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const valid = ref(false);
const username = ref('admin');
const lastname = ref('');
const show1 = ref(false);
const show2 = ref(false);
const password1 = ref('Password');
const password2 = ref('Password');
const email = ref('');

const rules = {
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 8 || 'Min 8 characters',
  emailMatch: () => `The email and password you entered don't match`,
};

const nameRules = [
  (value) => {
    if (value) return true;
    return 'Name is required.';
  },
  (value) => {
    if (value?.length <= 10) return true;
    return 'Name must be less than 10 characters.';
  },
];

const emailRules = [
  (value) => {
    if (value) return true;
    return 'E-mail is required.';
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;
    return 'E-mail must be valid.';
  },
];
</script>

<style lang="scss" scoped>
.v-responsive {
  overflow: visible;
}
</style>
