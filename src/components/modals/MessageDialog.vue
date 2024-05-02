<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card :data-type="type" class="py-4">
      <v-card-title v-if="title" class="text-h5">{{ title }}</v-card-title>
      <v-card-text class="message-text">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
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
  type: String,
});

const dialog = ref(props.modelValue);

// Watch for external changes to modelValue
watchEffect(() => {
  dialog.value = props.modelValue;
});

const emit = defineEmits(['update:modelValue']);

// Update parent component when dialog changes
watchEffect(() => {
  emit('update:modelValue', dialog.value);
});
</script>

<style scoped>
.v-card {
  border-left: 5px solid;
  border-color: #2196f3;
}

.v-card[data-type='warning'] {
  border-color: #fb8c00;
}

.v-card[data-type='error'] {
  border-color: #b00020;
}

.message-text {
  white-space: pre-line;
}
</style>
