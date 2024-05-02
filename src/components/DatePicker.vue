<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        :style="{ maxWidth: maxWidth ?? 'none' }"
        :label="label"
        :model-value="formattedDate"
        readonly
        v-bind="props"
        append-inner-icon="mdi-calendar"
        :variant="variant"
        hide-details
      ></v-text-field>
    </template>
    <v-date-picker v-model="selectedDate" hide-actions title="" :color="color">
      <template v-slot:header></template>
    </v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import { formatDateString } from '@/plugins/utils';

const { label, variant, color, modelValue, maxWidth } = defineProps(['label', 'variant', 'color', 'modelValue', 'maxWidth']);

const emit = defineEmits(['update:modelValue']);

const isMenuOpen = ref(false);
const selectedDate = ref(modelValue);

const formattedDate = computed(() => {
  if (selectedDate.value) {
    return formatDateString(selectedDate.value);
  }
  return '';
});

watch(
  () => modelValue,
  (newDate) => {
    selectedDate.value = newDate;
  },
);

watch(selectedDate, (newDate) => {
  emit('update:modelValue', newDate);
  isMenuOpen.value = false;
});
</script>

<style lang="scss" scoped>
.v-overlay__content:has(> .v-date-picker) {
  min-width: auto !important;
}
.v-picker-title {
  padding: 0 !important;
}
</style>
