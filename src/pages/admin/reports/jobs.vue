<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h5 mb-8">Job Reports</h1>

    <v-select style="width: 300px;" dense variant="solo" clearable label="Select Job"
        :items="['144 California', '145 Colorado', '146 Florida', '147 Georgia', '148 Texas']"></v-select>

    <v-sheet class="pa-8" color="#ffffff" border="sm" rounded="lg">
      <v-card class="d-flex flex-nowrap justify-center align-center" min-height="260" elevation="0">
        <v-card-text class="text-center">
          <v-icon icon="mdi-text-search" size="64" color="rgba(0,0,0,.3)"></v-icon>
          <p class="mt-4">Select a job to analyze data</p>
        </v-card-text>
      </v-card>
    </v-sheet>

  </v-container>
</template>

<script setup>
//
</script>

<style lang="scss" scoped>
</style>
