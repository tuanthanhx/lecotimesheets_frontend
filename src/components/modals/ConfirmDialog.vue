<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card class="py-4">
      <v-card-title v-if="title" class="text-h5">{{ title }}</v-card-title>
      <v-card-text class="message-text">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="cancel">Cancel</v-btn>
        <v-btn color="red darken-1" text @click="confirm">{{ confirmButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  confirmButtonText: String,
  cancelButtonText: String,
});

const dialog = ref(props.modelValue);
const emit = defineEmits(['update:modelValue', 'confirm']);

watchEffect(() => {
  dialog.value = props.modelValue;
});

watchEffect(() => {
  emit('update:modelValue', dialog.value);
});

const confirm = () => {
  emit('confirm');
  dialog.value = false;
};

const cancel = () => {
  dialog.value = false;
};
</script>

<style lang="scss" scoped>
.message-text {
  white-space: pre-line;
}
</style>
