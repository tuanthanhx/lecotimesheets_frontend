<template>
  <v-dialog v-model="isModalVisible" max-width="1200px">
    <v-card class="pa-4">
      <v-card-title>
        <span class="headline">Add Member</span>
      </v-card-title>
      <v-card-text class="pa-4">
        <v-responsive max-width="900">
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Username</h3>
              <v-text-field
                variant="solo-filled"
                v-model="username"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Password</h3>
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
              <h3 class="text-subtitle-2 mb-2">Full Name</h3>
              <v-text-field variant="solo-filled"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Email</h3>
              <v-text-field variant="solo-filled"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Phone</h3>
              <v-text-field variant="solo-filled"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Hourly Rate</h3>
              <v-text-field
                style="max-width: 200px"
                variant="solo-filled"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Language</h3>
              <v-select
                style="width: 200px"
                dense
                variant="solo-filled"
                value="Default"
                :items="['Default', 'English', 'Tiếng Việt']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-2 mb-2">Status</h3>
              <v-select
                style="width: 200px"
                dense
                variant="solo-filled"
                value="Active"
                :items="['Active', 'Deactivated']"
              ></v-select>
            </v-col>
          </v-row>
        </v-responsive>
      </v-card-text>
      <v-card-actions class="mt-4 justify-center">
        <v-btn
          class="text-none mr-4"
          variant="elevated"
          width="120"
          height="40"
          color="#2B343F"
          @click="closeModal"
          >Save</v-btn
        >
        <v-btn
          class="text-none"
          variant="elevated"
          width="120"
          height="40"
          @click="closeModal"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['closeModal']);

const isModalVisible = ref(false);

// defineProps({
//   selectedDessert: null,
// });

const closeModal = () => {
  emit('closeModal');
};

const valid = ref(false);
const username = ref(null);
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
