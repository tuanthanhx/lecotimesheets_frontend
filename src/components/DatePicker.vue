<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-text-field
        :style="`min-width: 200px; max-width: ${maxWidth ?? 'none'}`"
        :label="label"
        :model-value="formattedDate"
        readonly
        v-bind="props"
        append-inner-icon="mdi-calendar"
        :variant="variant"
        :density="density"
        :hide-details="hideDetails"
        :placeholder="placeholder"
      ></v-text-field>
    </template>
    <v-date-picker v-model="selectedDate" :max="today" hide-actions title="" :color="color">
      <template #header></template>
    </v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatDateString } from '@/plugins/utils';
import dayjs from 'dayjs';

const { label, variant, density, color, modelValue, maxWidth, placeholder, hideDetails } = defineProps({
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'outlined',
  },
  density: {
    type: String,
    default: 'default',
  },
  color: {
    type: String,
    default: 'primary',
  },
  modelValue: {
    type: [String, Date, Object, null],
    default: null,
  },
  maxWidth: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  hideDetails: {
    type: [Boolean, String],
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isMenuOpen = ref(false);
const selectedDate = ref(modelValue);
const today = dayjs().format('YYYY-MM-DD');
let isSyncingModelValue = false;

const normalizeDate = (date) => (date ? formatDateString(date) : '');

const formattedDate = computed(() => {
  return normalizeDate(selectedDate.value);
});

watch(
  () => modelValue,
  (newDate) => {
    if (normalizeDate(newDate) === normalizeDate(selectedDate.value)) {
      return;
    }
    isSyncingModelValue = true;
    selectedDate.value = newDate;
  },
);

watch(selectedDate, (newDate, oldDate) => {
  if (isSyncingModelValue) {
    isSyncingModelValue = false;
    return;
  }
  if (normalizeDate(newDate) === normalizeDate(oldDate)) {
    return;
  }
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
