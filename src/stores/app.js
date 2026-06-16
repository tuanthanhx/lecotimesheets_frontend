// Utilities
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    isRouteLoading: false,
  }),
  actions: {
    startRouteLoading() {
      this.isRouteLoading = true;
    },
    stopRouteLoading() {
      this.isRouteLoading = false;
    },
  },
});
